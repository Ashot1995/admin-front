import ResourceBase from "./resource_base";
import axios from "axios";
import store from "../../store/index"

const endpoint = process.env.VUE_APP_API_URL;

export default class LogisticFacilityResource extends ResourceBase {

    resourceRoute = 'logistic-facility'

    exportToExcel(elements = []) {

        let data = new FormData;
        elements.forEach(id => {
            data.append('id[]', id);
        });

        let promise = axios({
            method: 'post',
            url: endpoint + 'excel/logistic-facility/export',
            data: data,
            responseType: 'blob',
            headers: {
                Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                Authorization: 'Bearer ' + store.getters['Auth/getAccessToken'],
                'Content-Type': 'multipart/form-data'
            }
        });

        return promise;
    }

    importFromExcel(file) {

        let data = new FormData;
        data.append('file', file);

        let promise = axios({
            method: 'post',
            url: endpoint + 'excel/logistic-facility/import',
            data: data,
            responseType: 'json',
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + store.getters['Auth/getAccessToken'],
                'Content-Type': 'multipart/form-data'
            }
        });

        return promise;

    }

    massDelete(ids) {
        let query = [];
        ids.forEach((id, index) => query.push('id[' + index + ']=' + id));

        let promise = axios({
            method: 'delete',
            url: endpoint + 'logistic-facility?' + query.join('&'),
            responseType: 'json',
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + store.getters['Auth/getAccessToken']
            }
        });

        return promise;
    }
}
