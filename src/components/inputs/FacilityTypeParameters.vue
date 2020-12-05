<template>
    <div>

        <v-row>
            <v-col>
                <span class="subtitle-1">Дополнительные параметры:</span>
            </v-col>
            <v-col class="text-right">
                <v-btn color="green" dark @click="addParam">Добавить параметр</v-btn>
            </v-col>
        </v-row>

        <v-simple-table v-if="params.length > 0">
            <template v-slot:default>
                <thead>
                    <tr>
                        <th class="text-left">Название</th>
                        <th class="text-left">Код</th>
                        <th class="text-left">Значение<br>по умолчанию</th>
                        <th class="text-left">Обязательное</th>
                        <th class="text-left">Показать<br>в списке</th>
                        <th class="text-left">Действия</th>
                    </tr>
                </thead>
                <tbody>
                <tr v-for="(param, index) in params" :key="index">
                    <td>
                        <v-text-field
                            v-model="param.name"
                            :rules="rules.name"
                        ></v-text-field>
                    </td>
                    <td>
                        <v-text-field
                            v-model="param.code"
                            :rules="rules.code"
                        ></v-text-field>
                    </td>
                    <td>
                        <v-text-field
                            v-model="param.default"
                            :rules="rules.default"
                        ></v-text-field>
                    </td>
                    <td class="text-center">
                        <v-checkbox v-model="param.required"></v-checkbox>
                    </td>
                    <td class="text-center">
                        <v-checkbox v-model="param.list"></v-checkbox>
                    </td>
                    <td class="text-center">
                        <v-btn icon color="red" @click="deleteParam(index)">
                            <v-icon class="mdi mdi-delete-forever"></v-icon>
                        </v-btn>
                    </td>
                </tr>
                </tbody>
            </template>
        </v-simple-table>

    </div>
</template>

<script>

    export default {

        props: {
            initParams: Array
        },

        data() {
            return {
                rules: {
                    name: [
                        v => !!v || 'Необходимо заполнить название параметра',
                    ],
                    code: [
                        v => !!v || 'Необходимо ввести символьный код параметра',
                        v => !/[^a-z0-9_]/.test(v) || 'Символьный код может состоять из латинских букв в нижнем регистре, цифр и нижнего подчеркивания',
                        v => {
                            let props = this.params.filter(item => item.code === v)
                            return props.length > 1 ? 'Код должен быть уникальным в переделах одного типа' : true;
                        }
                    ]
                }
            }
        },

        computed: {
            params() {
                return this.initParams;
            }
        },

        methods: {

            addParam() {
                this.params.push({
                    name: '',
                    code: '',
                    default: '',
                    required: false,
                    list: false,
                    value: ''
                });
            },

            deleteParam(index) {
                this.params.splice(index, 1);
            }

        }

    }

</script>