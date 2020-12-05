import ResourceBase from "./resource_base";
import axios from "axios";
import store from "../../store";

const endpoint = process.env.VUE_APP_API_URL;

export default class TradeFacilityResource extends ResourceBase {

  resourceRoute = 'trade-facility'

  importFromExcel(file) {

    let data = new FormData;
    data.append('file', file);

    let promise = axios({
      method: 'post',
      url: endpoint + 'excel/trade-facility/import',
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

  exportToExcel(ids = []) {

    let data = new FormData;
    ids.forEach(id => {
      data.append('id[]', id);
    });

    let promise = axios({
      method: 'post',
      url: endpoint + 'excel/trade-facility/export',
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

}
