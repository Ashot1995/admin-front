import AuthResource from "../../api/resources/auth"
import router from "../../router/index"

let resource = new AuthResource();

export default {

    namespaced: true,

    state: {
        accessToken: localStorage.getItem('accessToken') || '',
        refreshToken: localStorage.getItem('refreshToken') || '',
        expiresIn: parseInt(localStorage.getItem('expiresIn')) || 0,
        user: JSON.parse(localStorage.getItem('user')) || {},
        errors: [],
        forbidden: false
    },

    getters: {

        getAccessToken: state => {
            return state.accessToken;
        },

        getRefreshToken: state => {
            return state.refreshToken;
        },

        isAuthorized: (state, getters) =>  {
            return !!state.accessToken && !getters.isExpired;
        },

        isExpired: state => {
            return Date.now() > state.expiresIn;
        },

        hasErrors: state => {
            return state.errors.length > 0;
        },

        getErrors: state => {
            return state.errors;
        },

        getUser: state => {
            return state.user;
        },

        getRoles: state => {
            return state.user.roles;
        },

        isForbidden: state => {
            return state.forbidden
        }

    },

    actions: {

        async login({commit}, credentials) {
            const {email, password} = credentials;

            try {
                let response = await resource.issue(email, password);
                commit('setTokens', response.data);
                router.push('/');
            } catch(error) {
                if(error.response.status === 404) {
                    commit('setErrors', {
                        email: [
                            'Пользователь не найден'
                        ]

                    })
                }
                else if(error.response.status === 422) {
                    commit('setErrors', error.response.data.errors)
                }
            }
        },

        async refresh({state, commit}) {
            try {
                let response = await resource.refresh(state.refreshToken);
                commit('setTokens', response.data);
            } catch(error) {
                router.push('/auth');
                console.error(error);
            }
        },

        async logout({state, commit}) {
            try {
                let response = await resource.revoke(state.accessToken);
                commit('clearTokens');
                router.push('/auth');
            } catch(error) {
                console.error(error);
            }
        },

        handle401({getters, dispatch, commit}, error) {

            if(error.response.status !== 401) return;

            let url = error.response.config.url;

            if(url.indexOf('/token/issue') !== -1) {

                commit('setErrors', {
                    password: [
                        'Неверный пароль'
                    ]
                });

            } else if(url.indexOf('/token/refresh') !== -1) {

                console.info('handle401: Рефреш не помог, разавторизация');
                dispatch('logout');

            } else if(url.indexOf('/token/revoke')) {

                console.info('handle401: Уже разавторизован, удаляем токены локально');
                commit('clearTokens');
                router.push({name: 'Auth'});

            } else {

                if(getters.isAuthorized) {
                    console.info('handle401: Токен не действителен, запрос рефреша');
                    dispatch('refresh');
                } else {
                    console.info('handle401: Переброс на логин');
                    router.push('/auth');
                }

            }
        },

        resetForbidden({commit}) {
            commit('setForbidden', false);
        },

        handle403({commit}, error) {
            if(error.response.status === 403)
                commit('setForbidden', true);
        },

    },

    mutations: {

        setTokens(state, data) {
            state.accessToken = data.access_token;
            state.refreshToken = data.refresh_token;
            state.expiresIn = Date.now() + (data.expires_in * 1000);

            localStorage.setItem('accessToken', state.accessToken);
            localStorage.setItem('refreshToken', state.refreshToken);
            localStorage.setItem('expiresIn', state.expiresIn);

            if(!!data.user) {
                state.user = data.user;
                localStorage.setItem('user', JSON.stringify(state.user));
            }
        },

        clearTokens(state) {
            state.accessToken = '';
            state.refreshToken = '';
            state.expiresIn = 0;

            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('expiresIn');
            localStorage.removeItem('user');
        },

        setErrors(state, errors) {
            state.errors = errors;
        },

        setForbidden(state, status) {
            state.forbidden = status;
        }

    }

}