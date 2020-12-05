<template>
    <div class="ma-5">
        <v-form v-if="!loading" v-model="valid" autocomplete="off">
            <v-container>
                <v-row align="center" justify="center">
                    <v-col sm="12" md="9" lg="6">

                        <h1>Редактирование: {{ user.name }}</h1>

                        <v-row class="pt-5">
                            <v-col>
                                <b>ID:</b> <span>{{ user.id }}</span>
                            </v-col>
                            <v-col>
                                <b>Создан:</b> <span>{{ created }}</span>
                            </v-col>
                            <v-col>
                                <b>Изменен:</b> <span>{{ updated }}</span>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-switch v-model="user.active" :label="activeDesc"></v-switch>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-text-field
                                        outlined
                                        label="Имя"
                                        type="text"
                                        v-model="user.name"
                                        :error="getFieldError('name').length > 0"
                                        :error-messages="getFieldError('name')"
                                        :rules="rules.name"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-text-field
                                        outlined
                                        label="Емайл"
                                        type="text"
                                        v-model="user.email"
                                        :error="getFieldError('email').length > 0"
                                        :error-messages="getFieldError('email')"
                                        :rules="rules.email"
                                        @input="clearFieldError('email')"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-text-field
                                        outlined
                                        label="Пароль"
                                        type="password"
                                        v-model="user.password"
                                        :error="getFieldError('password').length > 0"
                                        :error-messages="getFieldError('password')"
                                        :rules="rulesUpdatePwd"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-text-field
                                        outlined
                                        label="Подтверждение пароля"
                                        type="password"
                                        v-model="user.confirm"
                                        :error="getFieldError('confirm').length > 0"
                                        :error-messages="getFieldError('confirm')"
                                        :rules="rulesUpdatePwdConfirm"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-btn :color="valid ? 'green':'grey'" dark large @click="submit()">Сохранить</v-btn>
                                <v-btn class="ml-5" color="grey" dark large to="/client">Отмена</v-btn>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-container>
        </v-form>
    </div>
</template>

<script>

    import Client from "../../models/Client";
    import router from "../../router";

    export default {

        data() {
            return {
                valid: false,
                loading: true,
                user: {},
                errors: {},
                rules: {
                    name: [
                        v => !!v || 'Имя должно быть заполнено'
                    ],
                    email: [
                        v => !!v || 'Емайл должен быть заполнен',
                        v => /[^@]+@[^\.]+\.[a-z]+/.test(v) || 'Необходим корректный адрес электронной почты'
                    ],
                    password: [
                        v => !!v || 'Необходимо заполнить пароль',
                        v => v.length > 7 || 'Пароль должен содержать 8 и более символов',
                        v => /[A-z]/.test(v) || 'Пароль должен содержать хотя бы одну букву [ A-z ]',
                        v => /[0-9]/.test(v) || 'Пароль должен содержать хотя бы одну цифру [ 0-9 ]',
                        v => /[!@#$%^&*]/.test(v) || 'Пароль должен содержать хотя бы один спецсимвол [ !@#$%^&* ]',
                        v => !/[^A-z0-9!@#$%^&*]/.test(v) || 'Пароль должен состоять только из букв [ A-z ] цифр [ 0-9 ] и спецсимволов [ !@#$%^&* ]'
                    ],
                    confirm: [
                        v => !!v || 'Необходимо повторить введенный пароль',
                        v => v === this.user.password || 'Пароли не совпадают'
                    ]
                }
            }
        },

        computed: {

            activeDesc() {
                return this.user.active ? 'Активен' : 'Деактивирован'
            },

            rulesUpdatePwd() {
                if(this.user.password.length === 0)
                    return [v => true];
                else return this.rules.password;
            },

            rulesUpdatePwdConfirm() {
                if(this.user.confirm.length === 0 && this.user.password.length === 0)
                    return [v => true];
                else return this.rules.confirm;
            },

            created() {
                return this.formatDate(this.user.created);
            },

            updated() {
                return this.formatDate(this.user.updated);
            }

        },

        methods: {

            submit() {
                if(this.valid)
                    this.user.save()
                        .then(promise => {
                            router.push({name: 'ClientList'})
                        })
                        .catch(error => {
                            if(error.response.status === 422) {
                                this.errors = error.response.data.errors;
                            } else {
                                console.error(error);
                            }
                        });
            },

            getFieldError(field) {
                return !!this.errors[field] ? this.errors[field] : [];
            },

            clearFieldError(field) {
                if(!!this.errors[field])
                    delete this.errors[field]
            },

            getUser() {
                Client.getById(this.$route.params.id)
                    .then(client => {
                        this.user = client;
                        this.loading = false;
                    })
                    .catch(error => {
                        console.error(error);
                    })
            },

            formatDate(date) {
                return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
            }
        },

        mounted() {
            this.getUser();
        }
    }

</script>