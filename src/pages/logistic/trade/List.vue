<template>
  <div class="ma-5">

    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="items"
      :options.sync="options"
      :server-items-length="total"
      :loading="loading"
      multi-sort
      hide-default-footer
      show-select
    >

      <template v-slot:top>

        <v-toolbar flat color="white">
          <v-toolbar-title>Торговые объекты</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>

          <div class="pa-1 mr-5 import-export">
            <v-icon color="green" class="mdi mdi-file-excel mr-3"></v-icon>

            <v-btn class="mr-5" color="green" dark @click="exchange.import.dialog = true">
              <v-icon class="mdi mdi-upload"></v-icon>
              <span>Импорт</span>
            </v-btn>

            <v-btn :color="allowExcelExport ? 'green' : 'grey'" dark @click="exportToExcel">
              <v-icon class="mdi mdi-download"></v-icon>
              <span>Экспорт</span>
              <span v-if="selected.length > 0"> ({{ selected.length }})</span>
            </v-btn>
          </div>

          <v-btn color="green" dark large to="/trade/facility/add">
            <v-icon class="mdi mdi-plus"></v-icon>
            <span>Добавить</span>
          </v-btn>

        </v-toolbar>

        <v-divider class="my-5"></v-divider>

        <v-row justify="start" align="center">
          <v-col cols="auto" class="px-2">
            <v-checkbox
              class="px-5"
              v-model="isAllChecked"
              :indeterminate="isIntermediateChecked"
              :label="isAllChecked ? 'Очистить все' : 'Выделить всё'"
              @click.stop="toggleCheckAll"
            ></v-checkbox>
          </v-col>
          <!--v-col v-if="selected.length" cols="auto" class="mr-auto">
              <v-btn text color="red" @click="massDelete()">
                  <v-icon color="red lighten-1" class="pr-1">mdi-trash-can-outline</v-icon>
                  Удалить ({{ selected.length }})
              </v-btn>
          </v-col-->
        </v-row>

      </template>

      <template v-slot:body.prepend>
        <tr>
          <td></td>
          <td></td>
          <td>
            <v-text-field
              label="Название"
              v-model="search.name"
              @input="onSearchInput()"
              clearable
            ></v-text-field>
          </td>
          <td>
            <select-filter
              label="Город"
              v-model="filter.city_id"
              :items="filterItems.cities"
              item-text="name"
              item-value="id"
            ></select-filter>
          </td>
          <td>
            <v-text-field
              label="Адрес"
              v-model="search.address"
              @input="onSearchInput()"
              clearable
            ></v-text-field>
          </td>
          <td>
            <select-filter
              label="Формат"
              v-model="filter.format"
              :items="filterItems.format"
            ></select-filter>
          </td>
          <td>
            <select-filter
              label="Специализация"
              v-model="filter.specialization"
              :items="filterItems.specialization"
            ></select-filter>
          </td>
          <td>
            <select-filter
              label="Статус"
              v-model="filter.status"
              :items="filterItems.status"
            ></select-filter>
          </td>
          <td>
            <select-filter
              label="Оценка"
              v-model="filter.estimate"
              :items="filterItems.estimate"
            ></select-filter>
          </td>
          <td>
            <select-filter
              label="Расположение"
              v-model="filter.building"
              :items="filterItems.building"
            ></select-filter>
          </td>
          <td></td>
        </tr>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon @click="deleteItem(item)">mdi-delete-forever</v-icon>
      </template>

    </v-data-table>

    <v-row class="pa-5">
      <v-col cols="1">
        <v-select
          label="Кол-во на странице"
          v-model="options.itemsPerPage"
          :items="[10, 25, 50, 100]"
        ></v-select>
      </v-col>
      <v-col cols="1">
        <v-text-field
          label="Страница"
          :value="options.page"
          @input="onPageInput($event)"
          :rules="[v => v > 0 && v <= totalPages || 'Неверное значение']"
          type="number"
        ></v-text-field>
      </v-col>
      <v-col cols="10" class="text-center">
        <v-pagination
          v-if="totalPages > 1"
          v-model="options.page"
          :length="totalPages"
          total-visible="12"
        ></v-pagination>
      </v-col>
    </v-row>

    <v-dialog v-model="exchange.import.dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Импорт из *.xlsx</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row v-if="exchange.import.result.received">
              <v-col cols="12">{{ exchange.import.result.message }}</v-col>
              <v-col cols="12"><b>Добавлено:</b> {{ exchange.import.result.stored }}</v-col>
              <v-col cols="12"><b>Обновлено:</b> {{ exchange.import.result.updated }}</v-col>
              <v-col cols="12"><b>Удалено:</b> {{ exchange.import.result.deleted }}</v-col>
              <v-col cols="12"><b>Не найдено:</b> {{ exchange.import.result.not_found }}</v-col>
              <v-col cols="12"><b>Ошибок:</b> {{ exchange.import.result.errors }}</v-col>
            </v-row>
            <v-row v-else-if="exchange.import.loading" justify="center">
              <span>Загрузка...</span>
            </v-row>
            <v-form v-else v-model="exchange.import.valid">
              <v-row>
                <v-col>
                  <v-file-input
                    v-model="exchange.import.file"
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    label="Загрузите файл xlsx"
                    :rules="exchange.import.rules.file"
                    prepend-icon="mdi-file-excel"
                  ></v-file-input>
                </v-col>
              </v-row>
              <v-row justify="center">
                <v-btn
                  :color="exchange.import.valid ? 'green':'grey'"
                  dark
                  @click="startImport"
                >Импортировать</v-btn>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="exchange.import.result.received"
            color="blue darken-1"
            text
            @click="resetImport"
          >Загрузить еще</v-btn>
          <v-btn color="blue darken-1" text @click="exchange.import.dialog = false">Закрыть</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>

import TradeFacility from "../../../models/TradeFacility";
import {debounce} from "lodash";
import SelectFilter from "../../../components/inputs/SelectFilter";
import City from "../../../models/City";
import LogisticFacility from "../../../models/LogisticFacility";

export default {

  name: 'TradeFacilityList',

  data: () => ({
    loading: false,
    items: [],
    selected: [],
    ids: [],
    options: {
      itemsPerPage: 10,
      page: 1,
      sortBy: ['name'],
      sortDesc: [false]
    },
    search: {
      name: '',
      address: ''
    },
    filter: {
      format: [],
      specialization: [],
      status: [],
      estimate: [],
      building: [],
      city_id: []
    },
    filterItems: {
      format: [],
      specialization: [],
      status: [],
      estimate: [],
      building: [],
      cities: []
    },
    exchange: {
      import: {
        dialog: false,
        valid: true,
        loading: false,
        file: null,
        rules: {
          file: [
            v => !!v || 'Необходимо загрузить файл',
            v => !v || /.+\.xlsx$/.test(v.name) || 'Необходим файл *.xlsx'    //почему то mime type пустой, приходится так
          ]
        },
        result: {
          received: false,
          message: '',
          stored: 0,
          updated: 0,
          deleted: 0,
          not_found: 0,
          errors: 0
        }
      }
    },
    total: 0,
    headers: [
      {text: '#', value: 'id'},
      {text: 'Название', value: 'name'},
      {text: 'Город', value: 'city.name', sortable: false},
      {text: 'Адрес', value: 'address'},
      {text: 'Формат', value: 'format'},
      {text: 'Специализация', value: 'specialization'},
      {text: 'Статус', value: 'status'},
      {text: 'Оценка', value: 'estimate'},
      {text: 'Расположение', value: 'building'},
      {text: 'Действия', value: 'actions', sortable: false}
    ]
  }),

  computed: {

    apiQueryParams() {
      let order = [], filter = {};

      for(let i = 0; i < this.options.sortBy.length; i++) {
        order.push({
          by: this.options.sortBy[i],
          flow: this.options.sortDesc[i] ? 'desc' : 'asc'
        });
      }

      return {
        limit: this.options.itemsPerPage,
        page: this.options.page,
        order: JSON.stringify(order),
        filter: JSON.stringify(this.filter),
        search: JSON.stringify(this.search)
      }
    },

    totalPages() {
      return Math.ceil(this.total / this.options.itemsPerPage);
    },

    allowExcelExport() {
      return this.selected.length > 0;
    },

    isAllChecked() {
      return this.ids.length > 0 && this.ids.length === this.selected.length;
    },

    isIntermediateChecked() {
      return this.selected.length > 0 && this.selected.length < this.ids.length;
    }

  },

  methods: {

    getItems() {
      if(this.loading) return;
      this.loading = true;
      TradeFacility.index(this.apiQueryParams)
        .then(response => {
          this.items = response.items;
          this.total = response.pagination.total;
          if(this.options.page > this.totalPages) {
            this.options.page = this.totalPages;
          }
          this.reloadFilters(response.filters);
          this.reloadSelect(response.filters.ids);
          this.loading = false;
        })
        .catch(error => console.error(error));
    },

    reloadFilters(data) {
      this.filterItems.format = data.format.sort();
      this.filterItems.specialization = data.specialization.sort();
      this.filterItems.status = data.status.sort();
      this.filterItems.estimate = data.estimate.sort();
      this.filterItems.building = data.building.sort();
      this.filterItems.cities = data.cities
        .map(item => {
          if(item === null)
            return new City(0, ' Не указано')
          return item;
        })
        .sort((a, b) => {
          return a.name > b.name ? 1 : -1;
        });
    },

    reloadSelect(data) {
      this.ids = data;
      this.selected = this.selected.filter(item => {
        return this.ids.indexOf(item.id) !== -1;
      });
    },

    onSearchInput: debounce(function() {
      this.getItems();
    }, 1000),

    onPageInput: debounce(function(value) {
      this.options.page = parseInt(value);
    }, 1000),

    editItem(item) {
      this.$router.push({name: 'TradeFacilityEdit', params: {id: item.id}})
    },

    deleteItem(item) {
      let confirmation = confirm(`Объект ${item.name} будет безвозвратно удален. Все равно удалить?`);
      if(confirmation) {
        item.delete()
          .then((response) => {
            let pos = this.items.map(item => item.id).indexOf(item.id);
            this.items.splice(pos, 1);
          });
      }
    },

    startImport() {
      if(this.exchange.import.file == null) return;

      this.exchange.import.loading = true;
      TradeFacility.importFromExcel(this.exchange.import.file)
        .then(promise => {
          this.exchange.import.result = {
            received: true,
            message: promise.data.message,
            stored: promise.data.stored,
            updated: promise.data.updated,
            deleted: promise.data.deleted,
            not_found: promise.data.not_found,
            errors: promise.data.errors
          };
          this.exchange.import.loading = false;
          this.getItems();
        })
        .catch(error => console.error(error));
    },

    resetImport() {
      this.exchange.import.file = null;
      this.exchange.import.result = {
        received: false,
        message: '',
        stored: 0,
        updated: 0,
        deleted: 0,
        notFound: 0,
        errors: 0
      }
    },

    exportToExcel() {

      if(!this.allowExcelExport) return;

      TradeFacility.exportToExcel(this.selected.map(item => item.id))
        .then(response => {
          let blob = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
          let link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'export.xlsx';
          link.click();
          URL.revokeObjectURL(link.href);
        })
        .catch(error => console.error(error));
    },

    toggleCheckAll() {
      if(this.isAllChecked) {
        this.selected = [];
      } else {
        this.selected = this.ids.map(id => {
          return {id: id}
        });
      }
    }

  },

  watch: {
    options: {
      handler() {
        this.getItems();
      },
      deep: true
    },
    filter: {
      handler() {
        this.getItems();
      },
      deep: true
    }
  },

  mounted() {
    this.getItems();
  },

  components: {
    SelectFilter
  }

}

</script>
