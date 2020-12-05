<template>
    <v-container>
        <v-radio-group v-model="value" @change="$emit('input', value)">
            <v-row class="justify-center">
                <v-col v-for="pin in items" cols="3">
                    <label>
                        <div class="pin-icon" :class="pin.id === value ? 'green' : 'indigo'">
                            <img class="pin-icon__image" :src="'http://api.dev.inframap.mdhcode.ru' + pin.icon.public_path" alt="pin.name" />
                        </div>
                        <v-radio
                                :key="pin.id"
                                :label="pin.name"
                                :value="pin.id"
                                :rules="rules.value"
                        ></v-radio>
                    </label>
                </v-col>
            </v-row>
        </v-radio-group>
    </v-container>
</template>

<script>

    export default {

        props: {
            initItems: Array,
            initValue: Number
        },

        data() {
            return {
                items: [],
                value: 0,
                rules: {
                    value: [
                        v => v !== 0 || 'Необходимо выбрать иконку для пина карты'
                    ]
                }
            }
        },

        mounted() {
            this.items = this.initItems;
            this.value = this.initValue;
        },

        watch: {
            initItems(fresh, old) {
                this.items = fresh;
            }
        }

    }

</script>

<style>
    .pin-icon {
        width: 90px;
        height: 90px;
        border-radius: 50%;
        margin-bottom: 20px;
        cursor: pointer;
    }

    .pin-icon__image {
        width: 50px;
        height: 50px;
        margin: 20px;
    }
</style>