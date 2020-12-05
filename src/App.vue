<template>
    <v-app id="app">

        <template v-if="$route.name !== 'Auth'">

            <v-navigation-drawer v-model="drawer" app>
                <left-navigation></left-navigation>
            </v-navigation-drawer>

            <v-app-bar app color="indigo" dark>
                <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
                <v-toolbar-title>
                    <span class="font-weight-bold red--text text--lighten-2">Infra</span>
                    <span class="font-weight-bold">Map</span>
                </v-toolbar-title>
                <v-spacer />
                <span class="mr-5">{{ getUserName.toUpperCase() }}</span>
                <v-btn text @click="logout">
                    <v-icon>mdi-logout-variant</v-icon>
                    Выход
                </v-btn>
            </v-app-bar>
            <v-content>
                <forbidden v-if="isForbidden"></forbidden>
                <router-view v-else></router-view>
            </v-content>

        </template>

        <template v-if="$route.name === 'Auth'">

            <auth></auth>

        </template>

    </v-app>
</template>

<script>

    import Auth from "./pages/Auth";
    import LeftNavigation from "./components/sections/LeftNavigation";
    import Forbidden from "./pages/Forbidden";

    export default {

        props: {
          source: String
        },

        data: () => ({
            drawer: null
        }),

        computed: {

            getUserName() {
                return this.$store.getters['Auth/getUser'].name;
            },

            isForbidden() {
                return this.$store.getters['Auth/isForbidden'];
            }

        },

        methods: {

            logout() {
                this.$store.dispatch('Auth/logout');
            }

        },

        components: {
            Auth,
            Forbidden,
            LeftNavigation
        }

    }
</script>
