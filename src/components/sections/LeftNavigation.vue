<template>

    <v-list dense>
        <v-list-item v-if="isSuperAdmin" link to="/admin">
            <v-list-item-action>
                <v-icon>mdi-account-star</v-icon>
            </v-list-item-action>
            <v-list-item-content>
                <v-list-item-title>Администраторы</v-list-item-title>
            </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/client">
            <v-list-item-action>
                <v-icon>mdi-account</v-icon>
            </v-list-item-action>
            <v-list-item-content>
                <v-list-item-title>Пользователи</v-list-item-title>
            </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/logistic/facility-type">
            <v-list-item-action>
                <v-icon>mdi-shape</v-icon>
            </v-list-item-action>
            <v-list-item-content>
                <v-list-item-title>Типы логистических объектов</v-list-item-title>
            </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/logistic/facility">
            <v-list-item-action>
                <v-icon>mdi-warehouse</v-icon>
            </v-list-item-action>
            <v-list-item-content>
                <v-list-item-title>Логистические объекты</v-list-item-title>
            </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/trade/facility">
            <v-list-item-action>
                <v-icon>mdi-warehouse</v-icon>
            </v-list-item-action>
            <v-list-item-content>
                <v-list-item-title>Торговые объекты</v-list-item-title>
            </v-list-item-content>
        </v-list-item>
      <v-list-item link to="/layer">
        <v-list-item-action>
          <v-icon>mdi-dialpad</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Слой</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

</template>

<script>

    export default {

        computed: {

            isSuperAdmin() {
                let roles = this.$store.getters['Auth/getRoles'];
                return roles.indexOf('super') !== -1;
            }

        }

    }

</script>
