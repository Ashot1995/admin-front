<template>
    <div class="ma-5">
        <v-form v-if="!loading" v-model="valid">
            <v-container>
                <v-row align="center" justify="center">
                    <v-col sm="12" md="9" lg="6">

                        <v-row>
                            <v-col>
                                <span class="headline">Добавить новый объект</span>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col>
                                <v-select
                                    outlined
                                    label="Тип объекта"
                                    :items="types"
                                    item-text="name"
                                    item-value="id"
                                    v-model="facility.type_id"
                                    :rules="rules.type_id"
                                    :error="getFieldError('type_id').length > 0"
                                    :error-messages="getFieldError('type_id')"
                                    @change="setTypeParameters()"
                                    autofocus
                                ></v-select>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col>
                                <v-text-field
                                        outlined
                                        label="Название"
                                        v-model="facility.name"
                                        :rules="rules.name"
                                        :error="getFieldError('name').length > 0"
                                        :error-messages="getFieldError('name')"
                                        @input="clearFieldError('name')"
                                        :disabled="facility.type_id === 0"
                                ></v-text-field>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="6">
                                <v-text-field
                                        outlined
                                        label="Широта"
                                        v-model="facility.lat"
                                        :rules="rules.lat"
                                        :error="getFieldError('lat').length > 0"
                                        :error-messages="getFieldError('lat')"
                                        @input="clearFieldError('lat')"
                                        :disabled="facility.type_id === 0"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field
                                        outlined
                                        label="Долгота"
                                        v-model="facility.lng"
                                        :rules="rules.lng"
                                        :error="getFieldError('lng').length > 0"
                                        :error-messages="getFieldError('lng')"
                                        @input="clearFieldError('lng')"
                                        :disabled="facility.type_id === 0"
                                ></v-text-field>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col>
                                <v-text-field
                                        outlined
                                        label="Грузооборот"
                                        v-model="facility.cargo_turnover"
                                        :rules="rules.cargo_turnover"
                                        :error="getFieldError('cargo_turnover').length > 0"
                                        :error-messages="getFieldError('cargo_turnover')"
                                        @input="clearFieldError('cargo_turnover')"
                                        :disabled="facility.type_id === 0"
                                ></v-text-field>
                            </v-col>
                            <v-col>
                                <v-text-field
                                        outlined
                                        label="Контейнерооборот"
                                        v-model="facility.container_turnover"
                                        :rules="rules.container_turnover"
                                        :error="getFieldError('container_turnover').length > 0"
                                        :error-messages="getFieldError('container_turnover')"
                                        @input="clearFieldError('container_turnover')"
                                        :disabled="facility.type_id === 0"
                                ></v-text-field>
                            </v-col>
                        </v-row>

                        <v-row class="mb-5">
                            <v-col>
                                <v-divider></v-divider>
                            </v-col>
                        </v-row>

                        <facility-parameters :initParams="facility.parameters" @change="facility.parameters = $event"></facility-parameters>

                        <v-row>
                            <v-col>
                                <v-btn :color="valid ? 'green' : 'grey'" dark large @click="submit()">Добавить</v-btn>
                                <v-btn class="ml-5" color="grey" dark large to="/logistic/facility">Отмена</v-btn>
                            </v-col>
                        </v-row>

                    </v-col>
                </v-row>
            </v-container>
        </v-form>

    </div>
</template>

<script>
    import LogisitcFacility from '../../models/LogisticFacility'
    import LogisticFacilityType from "../../models/LogisticFacilityType";
    import FacilityParameters from "../../components/inputs/FacilityParameters";
    import router from "../../router";

    export default {

        data: () => {
            return {
                loading: true,
                valid: true,
                types: [],
                facility: new LogisitcFacility(),
                errors: {},
                rules: {
                    name: [
                        v => !!v || 'Необходимо заполнить имя',
                    ],
                    type_id: [
                        v => v !== 0 || 'Необходимо выбрать тип объекта'
                    ],
                    lat: [
                        v => !!v || 'Необходимо ввести широту',
                        v => !isNaN(parseFloat(v)) && isFinite(v) && /^-?\d+\.\d+/.test(v) || 'Координаты вводятся одним числом десятичной дробью через точку'
                    ],
                    lng: [
                        v => !!v || 'Необходимо ввести долготу',
                        v => !isNaN(parseFloat(v)) && isFinite(v) && /^-?\d+\.\d+/.test(v) || 'Координаты вводятся одним числом десятичной дробью через точку'
                    ],
                    cargo_turnover: [
                        v => !!v || 'Необходимо ввести грузооборот',
                        v => v >= 0 || 'Значение не может быть ниже нуля'
                    ],
                    container_turnover: [
                        v => !!v || 'Необходимо ввести контейнерооборот',
                        v => v >= 0 || 'Значение не может быть ниже нуля'
                    ]
                }
            }
        },

        computed: {

            defaultParams() {
                if(this.facility.type_id == 0)
                    return [];

                let type = this.types.find(item => this.facility.type_id == item.id);
                
                return type.parameters;
            }

        },

        methods: {

            submit() {
                if(this.valid)
                    this.facility.save()
                        .then(response => {
                            router.push({name: 'LogisticFacilityList'});
                        })
                        .catch(error => {
                            if(error.response.status === 422) {
                                this.errors = error.response.data.errors;
                            } else {
                                console.error(error);
                            }
                        });
            },

            getTypes() {
                this.loading = true;
                LogisticFacilityType.index({})
                    .then((response) => {
                        this.types = response.items;
                        this.loading = false;
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            },

            getFieldError(field) {
                return !!this.errors[field] ? this.errors[field] : [];
            },

            clearFieldError(field) {
                if(!!this.errors[field])
                    delete this.errors[field]
            },

            setTypeParameters() {
                this.facility.parameters = this.defaultParams
            }

        },

        mounted() {
            this.getTypes()
        },

        components: {
            FacilityParameters
        }

    }
</script>