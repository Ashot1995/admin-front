<template>
  <section class="ma-5">
    <v-container>
      <v-row align="center" justify="center">
        <v-col sm="12" md="9" lg="6">
          <v-form v-if="!loading" v-model="valid" ref="form">

            <v-row>
              <v-col>
                <span class="headline">{{ this.edit ? 'Редактировать: ' + this.item.name : 'Добавить торговый объект' }}</span>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="2">
                <v-checkbox
                  v-model="item.active"
                  label="Активность"
                  :disabled="!item.city"
                ></v-checkbox>
              </v-col>
              <v-col>
                <v-text-field
                  label="Название"
                  v-model="item.name"
                  :rules="rules.name"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-text-field
                  label="Адрес"
                  v-model="item.address"
                  :rules="rules.address"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-select
                  label="Город"
                  v-model="item.city"
                  :items="cities"
                  :rules="rules.city"
                  item-text="name"
                  return-object
                ></v-select>
              </v-col>
              <v-col>
                <v-text-field
                  label="Широта"
                  v-model="item.coords.lat"
                  :rules="rules.lat"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  label="Долгота"
                  v-model="item.coords.lng"
                  :rules="rules.lng"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-text-field
                  label="Формат"
                  v-model="item.format"
                  :rules="rules.format"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  label="Специализация"
                  v-model="item.specialization"
                  :rules="rules.specialization"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  label="Расположение"
                  v-model="item.building"
                  :rules="rules.building"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-select
                  label="Статус"
                  v-model="item.status"
                  :items="selects.status"
                  :rules="rules.status"
                ></v-select>
              </v-col>
              <v-col>
                <v-select
                  label="Оценка"
                  v-model="item.estimate"
                  :items="selects.estimate"
                  :rules="rules.estimate"
                ></v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-btn :color="valid ? 'green' : 'grey'" dark large @click="submit()">Сохранить</v-btn>
                <v-btn class="ml-5" color="grey" dark large @click="back">Назад</v-btn>
              </v-col>
            </v-row>

          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script>

import TradeFacility from "../../../models/TradeFacility";
import City from "../../../models/City";

export default {

  name: 'TradeFacilityEdit',

  data: () => ({
    edit: false,
    loading: true,
    valid: true,
    item: {},
    selects: {
      status: ['частный', 'сетевой'],
      estimate: ['мелкий', 'средний', 'крупный', 'комплекс']
    },
    rules: {
      name: [v => !!v || 'Необходимо заполнить поле "Название"'],
      city: [],
      address: [v => !!v || 'Необходимо заполнить поле "Адрес"'],
      lat: [
        v => !!v || 'Необходимо заполнить значение широты',
        v => /^-?\d+(\.\d+)?/.test(v) || 'Координаты вводятся одним числом десятичной дробью через точку',
        v => v >= -90 && v <= 90 || 'Широта должна быть в диапазоне +- 90 градусов'
      ],
      lng: [
        v => !!v || 'Необходимо заполнить значение долготы',
        v => /^-?\d+(\.\d+)?/.test(v) || 'Координаты вводятся одним числом десятичной дробью через точку',
        v => v >= -180 && v <= 180 || 'Долгота должна быть в диапазоне +- 180 градусов'
      ],
      format: [v => !!v || 'Необходимо заполнить поле "Формат"'],
      specialization: [v => !!v || 'Необходимо заполнить поле "Специализация"'],
      status: [v => !!v || 'Необходимо заполнить поле "Статус"'],
      estimate: [v => !!v || 'Необходимо заполнить поле "Оценка"'],
      building: [v => !!v || 'Необходимо заполнить поле "Расположение"']
    },
    cities: []
  }),

  methods: {

    getItem(id) {
      TradeFacility.getById(id)
        .then(response => {
          this.item = response;
          this.loading = false;
        })
        .catch(error => console.error(error));
    },

    getCities() {
      City.index()
        .then(response => {
          this.cities = response.items;
        })
        .catch(error => console.error(error));
    },

    submit() {
      if(this.valid) {
        this.item.save()
          .then(response => {
            this.item = TradeFacility.createFrom(response.data);
            if(!this.edit)
              this.$router.push({name: 'TradeFacilityEdit', params: {id: response.data.id}});
          })
          .catch(error => console.error(error));
      } else {
        this.$refs.form.validate();
      }
    },

    back() {
      this.$router.go(-1);
    }

  },

  mounted() {
    this.getCities();
    if(this.$route.name == 'TradeFacilityAdd') {
      this.item = new TradeFacility();
      this.loading = false;
      this.edit = false;
    } else {
      this.getItem(this.$route.params.id);
      this.edit = true;
    }
  }

}

</script>
