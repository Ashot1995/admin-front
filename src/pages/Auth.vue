<template>

    <v-content>
        <v-container class="fill-height" fluid>
            <v-row align="center" justify="center">
                <v-col cols="12" sm="8" md="4">
                    <v-card class="elevation-12">
                        <v-toolbar color="indigo" dark flat>
                            <v-toolbar-title>Пожалуйста авторизуйтесь</v-toolbar-title>
                            <v-spacer/>
                        </v-toolbar>
                        <v-card-text>
                            <v-form>
                                <v-text-field
                                        label="Емайл"
                                        name="email"
                                        prepend-icon="mdi-account"
                                        type="text"
                                        v-model="email"
                                        :error="emailErrors.length > 0"
                                        :error-messages="emailErrors"
                                />

                                <v-text-field
                                        label="Пароль"
                                        name="password"
                                        prepend-icon="mdi-key-variant"
                                        type="password"
                                        v-model="password"
                                        :error="passwordErrors.length > 0"
                                        :error-messages="passwordErrors"
                                />
                            </v-form>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer/>
                            <v-btn color="indigo" dark @click="submit">Войти</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-content>

</template>

<script>

    export default {

        data() {
            return {
                email: '',
                password: ''
            }
        },

        computed: {

            errors() {
                return this.$store.getters['Auth/getErrors'];
            },

            emailErrors() {
                return !!this.errors.email ? this.errors.email : [];
            },

            passwordErrors() {
                return !!this.errors.password ? this.errors.password : [];
            }
        },

        methods: {

            submit() {
                this.$store.dispatch('Auth/login', {email: this.email, password: this.password});
            }

        }

    }

</script>