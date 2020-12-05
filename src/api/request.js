import axios from 'axios';
import store from '../store/index';

const endpoint = process.env.VUE_APP_API_URL;

axios.interceptors.response.use((response) => {
    return response;
}, (error) => {

    //410 штатный ответ в данном случае на DELETE запрос
    if(error.response.status === 410 && error.config.method === 'delete') {
        return Promise.resolve(error.response);
    }

    //410 штатный ответ в случае отзыва токенов
    if(error.response.status === 410 && error.config.url.indexOf('token/revoke') !== -1) {
        return Promise.resolve(error.response);
    }

    //если в ходе работы выяснилось что авторизации нет
    if(error.response.status === 401) {
        store.dispatch('Auth/handle401', error);
    }

    //если в ходе работы, доступ к какому то ресурсу оказался запрещен
    if(error.response.status === 403) {
        store.dispatch('Auth/handle403', error);
    }

    return Promise.reject(error);
});

export default class Request {

    constructor(method, route, data = {}) {
        this.method = method;
        this.route = endpoint + route;
        this.data = data;
        this.accessToken = store.getters['Auth/getAccessToken'];
    }

    getResponse() {
        let response = null;

        let headers = {
            Accept: 'application/json'
        };

        if(this.accessToken.length > 0) {
            headers.Authorization = 'Bearer ' + this.accessToken;
        }

        switch(this.method) {
            case 'get':
                response = axios.get(this.route, {params: this.data, headers: headers});
                break;
            case 'post':
                response = axios.post(this.route, this.data, {headers: headers});
                break;
            case 'put':
                this.data._method = 'put';
                response = axios.post(this.route, this.data, {headers: headers});
                break;
            case 'delete':
                response = axios.delete(this.route, {headers: headers});
                break;
        }

        return response;
    }
}
