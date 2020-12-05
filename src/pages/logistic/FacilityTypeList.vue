<template>
    <div class="ma-5" v-if="!loading">


        <v-data-table
              :headers="headers"
              :items.sync="items"
              :items-per-page="itemsPerPage"
              :page="queryParameters.page"
              :loading="loading"
              hide-default-footer
        >

            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-toolbar-title>Типы объектов</v-toolbar-title>
                    <v-divider
                            class="mx-4"
                            inset
                            vertical
                    ></v-divider>
                    <v-spacer></v-spacer>
                    <v-btn color="green" dark large to="/logistic/facility-type/add">
                        <v-icon class="mdi mdi-plus"></v-icon>
                        <span>Добавить</span>
                    </v-btn>
                </v-toolbar>
            </template>

            <template v-slot:item.actions="{ item }">
                <v-icon class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                <v-icon @click="deleteItem(item)">mdi-delete-forever</v-icon>
            </template>

        </v-data-table>

        <v-pagination v-if="totalPages > 1" v-model="queryParameters.page" :length="totalPages"></v-pagination>

    </div>
</template>

<script>

    import LogisticFacilityType from "../../models/LogisticFacilityType";

    export default {

        data() {
            return {
                loading: true,
                items: [],
                pagination: {},
                queryParameters: {
                    by: 'id',
                    order: 'asc',
                    page: 1,
                    limit: 0
                },
                itemsPerPage: 50
            }
        },

        computed: {

            headers() {
                return [
                    {text: '#', value: 'id'},
                    {text: 'Название', value: 'name'},
                    {text: 'Зум', value: 'zoom'},
                    {text: 'Действия', value: 'actions', sortable: false}
                ]
            },

            totalPages() {
                return Math.ceil(this.pagination.items.total / this.itemsPerPage);
            }

        },

        methods: {

            editItem(item) {
                this.$router.push({name: 'LogisticFacilityTypeEdit', params: {id: item.id}})
            },

            deleteItem(item) {
                let confirmation = confirm(`Объект ${item.name} будет безвозвратно удален. Все равно удалить?`);
                if(confirmation) {
                    item.delete()
                        .then((promise) => {
                            this.getTypes();
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                }
            },

            getTypes() {
                this.loading = true;
                LogisticFacilityType.index(this.queryParameters)
                    .then((response) => {
                        this.items = response.items;
                        this.pagination = response.pagination;
                        this.loading = false;
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }

        },

        mounted() {
            this.getTypes();
        }

    }

</script>