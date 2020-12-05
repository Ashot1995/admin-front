<template>
  <div>
    <v-select
      :label="label"
      :items="filteredItems"
      v-model="_value"
      :item-text="itemText"
      :item-value="itemValue"
      multiple
      small-chips
      deletable-chips
    >

      <template v-slot:append-outer>
        <v-btn
          x-small
          icon
          @click.stop="input()"
          color="success"
        >
          <v-icon>mdi-filter</v-icon>
        </v-btn>
      </template>

      <template v-slot:prepend-item>
        <div class="pa-4">
          <v-text-field
            label="Фильтр"
            v-model="filter"
          ></v-text-field>
        </div>
      </template>

    </v-select>
  </div>
</template>

<script>

export default {

  name: 'SelectFilter',

  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      type: Array,
      required: true
    },
    items: {
      type: Array,
      required: true
    },
    itemText: {
      type: String,
      required: false,
      default: 'text'
    },
    itemValue: {
      type: String,
      required: false,
      default: 'value'
    }
  },

  data: () => ({
    _value: [],
    filter: ''
  }),

  computed: {

    filteredItems() {
      if(this.items.length) {
        if(this.items[0] instanceof Object) {
          return this.items.filter(item => !!item[this.itemText] && item[this.itemText].indexOf(this.filter) !== -1);
        } else {
          return this.items.filter(item => !!item && item.indexOf(this.filter) !== -1);
        }
      } else {
        return [];
      }
    }

  },

  methods: {

    input() {
      this.$emit('input', this._value);
    }

  },

  created() {
    this._value = this.value.map(item => item);
  }

}

</script>
