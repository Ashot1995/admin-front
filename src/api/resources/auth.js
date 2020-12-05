import Request from "../request";
import axios from 'axios';
import store from '../../store/index'

export default class AuthResource {

    client = 'admin_panel';

    issue(email, password) {
        let request = new Request('post', 'token/issue', {email: email, password: password, client: this.client});

        return request.getResponse();
    }

    refresh() {
        let request = new Request('post', 'token/refresh', {refresh_token: store.getters['Auth/getRefreshToken'], client: this.client});

        return request.getResponse()
    }

    revoke() {
        let request = new Request('post', 'token/revoke', {});

        return request.getResponse();
    }

}