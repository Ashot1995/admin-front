<template>
  <div class="ma-5" v-if="!loading">


    <v-data-table
      :headers="headers"
      :items.sync="items"
      :items-per-page="itemsPerPage"
      :page="queryParameters.page"
      :loading="loading"
      hide-default-footer
    >

      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Типы объектов</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>
          <v-btn color="green" dark large to="/layer/add">
            <v-icon class="mdi mdi-plus"></v-icon>
            <span>Добавить</span>
          </v-btn>
        </v-toolbar>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon @click="deleteItem(item)">mdi-delete-forever</v-icon>
      </template>

    </v-data-table>

    <v-pagination
      v-if="totalPages > 1"
      v-model="queryParameters.page"
      :length="totalPages"
    ></v-pagination>

  </div>
</template>

<script>

import Layer from "../../models/Layer";
import LogisticFacilityType from "@/models/LogisticFacilityType";

export default {

  data() {
    return {
      loading: true,
      items: [],
      pagination: {},
      queryParameters: {
        by: 'id',
        order: 'asc',
        page: 1,
        limit: 0
      },
      itemsPerPage: 50
    }
  },

  computed: {

    headers() {
      return [
        {text: '#', value: 'id'},
        {text: 'Название', value: 'name'},
        {text: 'Обект', value: 'logistic_facility_types_id'},
        {text: 'Действия', value: 'actions', sortable: false}
      ]
    },

    totalPages() {
      return Math.ceil(60/ this.itemsPerPage);
    }

  },

  methods: {

    editItem(item) {
      this.$router.push({name: 'LayerEdit', params: {id: item.id}})
    },

    deleteItem(item) {
      let confirmation = confirm(`Объект ${item.name} будет безвозвратно удален. Все равно удалить?`);
      if (confirmation) {
        item.delete()
          .then((promise) => {
            this.getTypes();
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
    comparer(otherArray){
      return function(current){
        return otherArray.filter(function(other){
          return other.id == current
        }).length == 0;
      }
    },
    getTypes() {
      let arr = []
      this.loading = true;
      LogisticFacilityType.index(this.queryParameters)
        .then((response) => {
       this.items.forEach(items=>{
         let a =[]
         JSON.parse(items.logistic_facility_types_id).forEach((item,index)=>{
           response.items.forEach(as=>{
             if(as.id ==item){
               a.push(as.name)
             }
           })
         })
         arr.push(a)
         a =[]
       })
          arr.forEach((item,index)=>{
           this.items[index].logistic_facility_types_id = item
          })
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getLayer() {
      this.loading = true;
      Layer.index(this.queryParameters)
        .then((response) => {
          this.items = response.items;
          this.loading = false;
        })
        .catch((error) => {
          console.error(error);
        });
    }

  },

  mounted() {
    this.getLayer();
    this.getTypes();
  }

}

</script>
