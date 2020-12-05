<template>
  <div class="ma-5">

    <v-form v-if="loading" v-model="valid">

      <v-container>
        <v-row align="center" justify="center">
          <v-col sm="12" md="9" lg="6">

            <v-row>
              <v-col>
                <span class="headline">Редактировать тип: {{ layer.name }}</span>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field
                  outlined
                  label="Название"
                  v-model="layer.name"
                  :rules="rules.name"
                  :error="getFieldError('name').length > 0"
                  :error-messages="getFieldError('name')"
                  @input="clearFieldError('name')"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-select
                  v-model="layer.logistic_facility_types_id"
                  :items="items"
                  item-text="name"
                  item-value="id"
                  facility
                  label="Facility Type"
                  multiple
                  solo
                ></v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-btn :color="valid ? 'green' : 'grey'" dark large @click="submit()">Сохранить</v-btn>
                <v-btn class="ml-5" color="grey" dark large to="/layer">Отмена</v-btn>
              </v-col>
            </v-row>

          </v-col>
        </v-row>
      </v-container>
    </v-form>

  </div>
</template>

<script>

import Layer from "../../models/Layer";
import router from "../../router";
import LogisticFacilityType from "@/models/LogisticFacilityType";


export default {

  data() {
    return {
      loading: true,
      valid: true,
      layer: {},
      items:[],
      pins: [],
      errors: {},
      rules: {
        name: [
          v => !!v || 'Необходимо заполнить название типа объекта'
        ]
      }
    }
  },

  methods: {

    submit() {
      if(this.valid)
        this.layer.save()
          .then(promise => {
            router.push({name: 'LayerList'})
          })
          .catch(error => {
            if(error.response.status === 422) {
              this.errors = error.response.data.errors;
            } else {
              console.error(error);
            }
          });
    },

    getLayer() {
      this.loading = true;
      Layer.getById(this.$route.params.id)
        .then((response) => {
          this.layer = response;
          this.layer.logistic_facility_types_id = JSON.parse(response.logistic_facility_types_id)
        })
        .catch((error) => {
          console.error(error);
        })
    },
    getTypes() {
      LogisticFacilityType.index(this.queryParameters)
        .then((response) => {
          this.items = response.items
          console.log(this.items)
        })
        .catch((error) => {
          console.error(error)
        })
    },

    getFieldError(field) {
      return !!this.errors[field] ? this.errors[field] : [];
    },

    clearFieldError(field) {
      if(!!this.errors[field])
        delete this.errors[field]
    }
  },

  mounted() {
    this.getLayer()
    this.getTypes();
  },


}

</script>
