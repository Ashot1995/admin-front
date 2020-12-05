<template>
    <div v-if="!loading" class="ma-5">

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
                    <v-toolbar-title>Пользователи</v-toolbar-title>
                    <v-divider
                            class="mx-4"
                            inset
                            vertical
                    ></v-divider>
                    <v-spacer></v-spacer>
                    <v-btn color="green" dark large to="/client/add">
                        <v-icon class="mdi mdi-plus"></v-icon>
                        <span>Добавить</span>
                    </v-btn>
                </v-toolbar>
            </template>

            <template v-slot:item.created="{ item }">
                {{ dateFormat(item.created) }}
            </template>

            <template v-slot:item.updated="{ item }">
                {{ dateFormat(item.updated) }}
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

    import Client from "../../models/Client";

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
                    {text: 'Активность', value: 'active'},
                    {text: 'Имя', value: 'name'},
                    {text: 'Емайл', value: 'email'},
                    {text: 'Создан', value: 'created', sort: (a, b) => a > b ? 1 : -1},
                    {text: 'Изменен', value: 'updated', sort: (a, b) => a > b ? 1 : -1},
                    {text: 'Действия', value: 'actions', sortable: false}
                ]
            },

            totalPages() {
                return Math.ceil(this.pagination.items.total / this.itemsPerPage);
            }

        },

        methods: {

            editItem(item) {
                this.$router.push({name: 'ClientEdit', params: {id: item.id}})
            },

            deleteItem(item) {
                let confirmation = confirm(`Пользователь ${item.name} будет безвозвратно удален. Все равно удалить?`);
                if(confirmation) {
                    item.delete()
                        .then((promise) => {
                            this.getItems()
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                }
            },

            getItems() {
                this.loading = true;
                Client.index(this.queryParameters)
                    .then(data => {
                        this.items = data.items;
                        this.pagination = data.pagination;
                        this.loading = false;
                    })
                    .catch(error => {
                        console.error(error);
                    })
            },

            dateFormat(date) {
                if(!!date)
                    return date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
            }

        },

        mounted() {
            this.getItems()
        }

    }

</script>
