<template>
    <div class="ma-5">

        <v-form v-model="valid">

            <v-container>
                <v-row align="center" justify="center">
                    <v-col sm="12" md="9" lg="6">

                        <v-row>
                            <v-col>
                                <span class="headline">Добавить новый тип объекта</span>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col>
                                <v-text-field
                                        outlined
                                        label="Название"
                                        v-model="type.name"
                                        :rules="rules.name"
                                        :error="getFieldError('name').length > 0"
                                        :error-messages="getFieldError('name')"
                                        @input="clearFieldError('name')"
                                ></v-text-field>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col>
                                <v-text-field
                                        outlined
                                        label="Зум"
                                        v-model="type.zoom"
                                        :rules="rules.zoom"
                                        :error="getFieldError('zoom').length > 0"
                                        :error-messages="getFieldError('zoom')"
                                        @input="clearFieldError('zoom')"
                                ></v-text-field>
                            </v-col>
                        </v-row>

                        <pin-selector :initItems="pins" :initValue="type.pin_id" @input="type.pin_id = $event"></pin-selector>

                        <v-row>
                            <v-col>
                                <v-divider></v-divider>
                            </v-col>
                        </v-row>

                        <facility-type-parameters :initParams="type.parameters"></facility-type-parameters>

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

    import LogisticFacilityType from "../../models/LogisticFacilityType";
    import FacilityTypeParameters from "../../components/inputs/FacilityTypeParameters"
    import router from "../../router";
    import PinResource from "../../api/resources/pin";
    import PinSelector from "../../components/inputs/PinSelector";

    let pinResource = new PinResource();

    export default {

        data() {
            return {
                loading: true,
                valid: true,
                type: new LogisticFacilityType(),
                pins: [],
                errors: {},
                rules: {
                    name: [
                        v => !!v || 'Необходимо заполнить название типа объекта'
                    ],
                    zoom: [
                        v => Number.isInteger(parseFloat(v)) || 'Зум должен быть целым числом',
                        v => !!v || 'Необходимо указать зум',
                        v => (v > 0 && v < 21) || 'Необходимо число от 1 до 20'
                    ]
                }
            }
        },

        methods: {

            submit() {
                if(this.valid)
                    this.type.save()
                        .then(promise => {
                            router.push({name: 'LogisticFacilityTypeList'})
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

            getPins() {
                this.loading = true;
                pinResource.index({limit: 0, by: 'name', order: 'asc'})
                    .then(promise => {
                        this.pins = promise.data.data;
                        this.loading = false;
                    })
                    .catch(error => console.error(error));
            }
        },

        mounted() {
            this.getPins()
        },

        components: {
            FacilityTypeParameters,
            PinSelector
        }

    }

</script>
