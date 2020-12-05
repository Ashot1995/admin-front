<template>

    <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="4">
                <v-card class="elevation-12">
                    <v-toolbar color="indigo" dark flat>
                        <v-toolbar-title>Доступ запрещен</v-toolbar-title>
                        <v-spacer/>
                    </v-toolbar>
                    <v-card-text>
                        У вас не доступа к запрашиваемому ресурсу
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer/>
                        <v-btn color="indigo" dark @click="back">Вернуться назад</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>

</template>

<script>

    import router from "../router/index";

    export default {

        methods: {

            back() {
                router.go(-1);
            }

        }

    }

</script>