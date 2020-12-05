<template>
    <div class="ma-5" v-if="!loading">

        <v-data-table
            v-model="selected"
            :headers="headers"
            :items.sync="items"
            :items-per-page="itemsPerPage"
            :page="queryParameters.page"
            :loading="loading"
            :search="search"
            hide-default-footer
            show-select
            @pagination="pagination.items.total = $event.itemsLength"
        >

            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-toolbar-title>Объекты</v-toolbar-title>
                    <v-divider
                            class="mx-4"
                            inset
                            vertical
                    ></v-divider>
                    <v-spacer></v-spacer>
                    <v-text-field
                        class="mr-5"
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="Поиск"
                        single-line
                        hide-details
                        clearable
                    ></v-text-field>

                    <div class="pa-1 mr-5 import-export">
                        <v-icon color="green" class="mdi mdi-file-excel mr-3"></v-icon>

                        <v-btn class="mr-5" color="green" dark @click="exchange.import.dialog = true">
                            <v-icon class="mdi mdi-upload"></v-icon>
                            <span>Импорт</span>
                        </v-btn>

                        <v-btn :color="allowExcelExport ? 'green' : 'grey'" dark @click="exportToExcel">
                            <v-icon class="mdi mdi-download"></v-icon>
                            <span>Экспорт</span>
                            <span v-if="selected.length > 0"> ({{ selected.length }})</span>
                        </v-btn>
                    </div>

                    <v-btn color="green" dark large to="/logistic/facility/add">
                        <v-icon class="mdi mdi-plus"></v-icon>
                        <span>Добавить</span>
                    </v-btn>

                </v-toolbar>

                <v-divider class="my-5"></v-divider>

                <v-row justify="space-around" align="baseline">
                    <span>Типы объектов:</span>
                    <v-checkbox
                        v-for="type in types"
                        v-model="filters.type"
                        multiple
                        class="mx-2"
                        :label="type.name"
                        :value="type.name"
                    ></v-checkbox>
                </v-row>

                <v-row justify="start" align="center">
                    <v-col cols="auto" class="px-2">
                        <v-checkbox
                            class="px-5"
                            v-model="isAllChecked"
                            :indeterminate="isNotAllChecked"
                            :label="isAllChecked ? 'Очистить все' : 'Выделить всё'"
                            @click.stop="toggleCheckAll"
                        ></v-checkbox>
                    </v-col>
                    <v-col v-if="selected.length" cols="auto" class="mr-auto">
                        <v-btn text color="red" @click="massDelete()">
                            <v-icon color="red lighten-1" class="pr-1">mdi-trash-can-outline</v-icon>
                            Удалить ({{ selected.length }})
                        </v-btn>
                    </v-col>
                </v-row>

            </template>

            <template v-slot:item.actions="{ item }">
                <v-icon class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                <v-icon @click="deleteItem(item)">mdi-delete-forever</v-icon>
            </template>

        </v-data-table>

        <v-pagination v-if="totalPages > 1" v-model="queryParameters.page" :length="totalPages"></v-pagination>

        <v-dialog v-model="exchange.import.dialog" max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Импорт из *.xlsx</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row v-if="exchange.import.result.received">
                            <v-col cols="12">{{ exchange.import.result.message }}</v-col>
                            <v-col cols="12"><b>Добавлено:</b> {{ exchange.import.result.stored }}</v-col>
                            <v-col cols="12"><b>Обновлено:</b> {{ exchange.import.result.updated }}</v-col>
                            <v-col cols="12"><b>Удалено:</b> {{ exchange.import.result.deleted }}</v-col>
                        </v-row>
                        <v-row v-else-if="exchange.import.loading" justify="center">
                            <span>Загрузка...</span>
                        </v-row>
                        <v-form v-else v-model="exchange.import.valid">
                            <v-row>
                                <v-col>
                                    <v-file-input
                                        v-model="exchange.import.file"
                                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                        label="Загрузите файл xlsx"
                                        :rules="exchange.import.rules.file"
                                        prepend-icon="mdi-file-excel"
                                    ></v-file-input>
                                </v-col>
                            </v-row>
                            <v-row justify="center">
                                <v-btn
                                    :color="exchange.import.valid ? 'green':'grey'"
                                    dark
                                    @click="startImport"
                                >Импортировать</v-btn>
                            </v-row>
                        </v-form>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        v-if="exchange.import.result.received"
                        color="blue darken-1"
                        text
                        @click="resetImport"
                    >Загрузить еще</v-btn>
                    <v-btn color="blue darken-1" text @click="exchange.import.dialog = false">Закрыть</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </div>
</template>

<script>

    import LogisticFacility from "../../models/LogisticFacility";
    import LogisticFacilityType from "../../models/LogisticFacilityType";
    import uniqBy from 'lodash/uniqBy';
    import axios from "axios";

    export default {

        data: () => {
            return {
                exchange: {
                    import: {
                        dialog: false,
                        valid: true,
                        loading: false,
                        file: null,
                        rules: {
                            file: [
                                v => !!v || 'Необходимо загрузить файл',
                                v => !v || /.+\.xlsx$/.test(v.name) || 'Необходим файл *.xlsx'    //почему то mime type пустой, приходится так
                            ]
                        },
                        result: {
                            received: false,
                            message: '',
                            stored: 0,
                            updated: 0,
                            deleted: 0
                        }
                    }
                },
                loading: true,
                selected: [],
                search: '',
                items: [],
                types: [],
                pagination: {},
                queryParameters: {
                    by: 'id',
                    order: 'asc',
                    page: 1,
                    limit: 0
                },
                filters: {
                    type: []
                },
                itemsPerPage: 100000
            }
        },

        computed: {

            headers() {
                return [
                    {text: '#', value: 'id'},
                    {text: 'Название', value: 'name'},
                    {text: 'Грузооборот', value: 'cargo_turnover'},
                    {text: 'Контейнерооборот', value: 'container_turnover'},
                    {
                        text: 'Тип',
                        value: 'type.name',
                        filter: value => {
                            if(this.filters.type.length === 0) return true;
                            return this.filters.type.indexOf(value) !== -1;
                        }
                    },
                    ...this.getAdditionalHeaders,
                    {text: 'Действия', value: 'actions', sortable: false}
                ]
            },

            totalPages() {
                return Math.ceil(this.pagination.items.total / this.itemsPerPage);
            },

            getAdditionalParams() {
                let params = [];

                this.types.forEach(type => {
                    type.parameters.forEach(param => {
                        if(param.list === true)
                            params.push(param);
                    })
                });

                return params;
            },

            getAdditionalHeaders() {
                let headers = [];

                this.getAdditionalParams.forEach(param => {
                    headers.push({
                        code: param.code,
                        text: param.name,
                        value: 'params.' + param.code
                    });
                });

                return uniqBy(headers, 'code');
            },

            allowExcelExport() {
                return this.selected.length > 0;
            },

            isAllChecked()
            {
                return this.items.length > 0 && this.items.length === this.selected.length;
            },

            isNotAllChecked()
            {
                return this.selected.length > 0 && this.selected.length < this.items.length;
            }

        },

        methods: {

            getTypeById(id) {
                return this.types.filter((item) => {
                    return id === item.id;
                })[0];
            },

            getData() {
                LogisticFacilityType.index({})
                    .then(response => {
                        this.types = response.items;
                        LogisticFacility.index(this.queryParameters)
                            .then(response => {
                                this.items = response.items.map(item => {
                                    item.type = this.getTypeById(item.type_id);
                                    return item;
                                });
                                this.pagination = response.pagination;
                                this.loading = false;
                            })
                            .catch(error => {
                                console.error(error);
                            })
                    })
                    .catch(error => {
                        console.error(error);
                    })
            },

            getItems() {

                this.loading = true;

                LogisticFacility.index(this.queryParameters)
                    .then(response => {
                        this.items = response.items;
                        this.pagination = response.pagination;
                        this.loading = false;
                    })
                    .catch(error => {
                        console.error(error);
                    });
            },

            editItem(item) {
                this.$router.push({name: 'LogisticFacilityEdit', params: {id: item.id}})
            },

            deleteItem(item) {
                let confirmation = confirm(`Объект ${item.name} будет безвозвратно удален. Все равно удалить?`);
                if(confirmation) {
                    item.delete()
                        .then((response) => {
                            let pos = this.items.map(item => item.id).indexOf(item.id);
                            this.items.splice(pos, 1);
                        });
                }
            },

            massDelete() {
                let confirmation = confirm(`${this.selected.length} объектов будут безвозвратно удалены. Все равно удалить?`);
                if(confirmation) {
                    LogisticFacility.massDelete(this.selected.map(item => item.id))
                        .then(() => {
                            this.selected.forEach(item => {
                                let pos = this.items.map(item => item.id).indexOf(item.id);
                                this.items.splice(pos, 1);
                            });
                            this.selected = [];
                        })
                        .catch(error => console.error(error));
                }
            },

            exportToExcel() {
                if(!this.allowExcelExport) return;

                LogisticFacility.exportToExcel(this.selected.map(v => v.id))
                    .then(response => {
                        let blob = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
                        let link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.download = 'export.xlsx';
                        link.click();
                        URL.revokeObjectURL(link.href);
                    })
                    .catch(error => console.error(error));
            },

            startImport() {
                if(this.exchange.import.file == null) return;

                this.exchange.import.loading = true;
                LogisticFacility.importFromExcel(this.exchange.import.file)
                    .then(promise => {
                        this.exchange.import.result = {
                            received: true,
                            message: promise.data.message,
                            stored: promise.data.stored,
                            updated: promise.data.updated,
                            deleted: promise.data.deleted
                        };
                        this.exchange.import.loading = false;
                    })
                    .catch(error => console.error(error));
            },

            resetImport() {
                this.exchange.import.file = null;
                this.exchange.import.result = {
                    received: false,
                    message: '',
                    stored: 0,
                    updated: 0,
                    deleted: 0
                }
            },

            toggleCheckAll() {
                console.log(this.isAllChecked);
                if(this.isAllChecked) {
                    this.selected = [];
                } else {
                    this.selected = this.items.filter(item => true);
                }
            }

        },

        mounted() {

            this.getData();
        }
    }
</script>

<style>

    .import-export {
        border: 1px solid lightgrey;
        border-radius: 4px;
    }

</style>
