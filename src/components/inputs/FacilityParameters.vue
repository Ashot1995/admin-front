<template>
    <div>

        <v-row v-if="params.length > 0">
            <v-col>
                <span class="subtitle-1">Дополнительные параметры:</span>
            </v-col>
        </v-row>

        <v-simple-table v-if="params.length > 0">
            <template v-slot:default>
                <thead>
                <tr>
                    <th class="text-left">Значения</th>
                    <th v-if="hasAnyDefault" class="text-left">По умолчанию</th>
                    <th v-if="hasAnyDelete" class="text-left">Действия</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(param, index) in params" :key="index">
                    <td>
                        <v-text-field
                            :label="param.name"
                            v-model="param.value"
                            @input="sendToParent"
                            :rules="param.required ? [v => !!v || 'Параметр ' + param.name + ' необходим для заполнения'] : []"
                        ></v-text-field>
                    </td>
                    <td v-if="hasAnyDefault">
                        <template v-if="param.default.length > 0">
                            <v-btn icon @click="setDefaultValue(index)">
                                <v-icon color="blue" class="mdi mdi-chevron-double-left"></v-icon>
                            </v-btn>
                            <span>{{ param.default }}</span>
                        </template>
                    </td>
                    <td v-if="hasAnyDelete">
                        <v-btn v-if="param.delete" icon color="red" @click="deleteParam(index)">
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
                params: []
            }
        },

        computed: {

            hasAnyDelete() {
                return this.params.find(item => !!item.delete && item.delete === true) ? true : false;
            },

            hasAnyDefault() {
                return this.params.find(item => item.default.length > 0) ? true : false;
            }
        },

        methods: {

            sendToParent() {
                this.$emit('change', this.params);
            },

            deleteParam(index) {
                this.params.splice(index, 1);
                this.sendToParent();
            },

            setDefaultValue(index) {
                this.params[index].value = this.params[index].default;
                this.sendToParent();
            }
        },

        mounted() {
            this.params = this.initParams;
        },

        watch: {
            initParams(newVal, oldVal) {
                this.params = this.initParams;
            }
        }

    }

</script>