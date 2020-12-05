import ActiveRecord from "./ActiveRecord";
import LogisticFacilityResource from "../api/resources/logistic_facility";

let resource = new LogisticFacilityResource();

export default class LogisitcFacility extends ActiveRecord {

    static resource = resource;
    resource = resource;

    params = {};

    constructor(id = null, name = "", type_id = 0, lat = "", lng = "", parameters = [], cargo_turnover, container_turnover) {
        super(id);
        this.name = name;
        this.type_id = type_id;
        this.lat = lat;
        this.lng = lng;
        this.cargo_turnover = cargo_turnover;
        this.container_turnover = container_turnover;
        this.parameters = parameters;

        this.parameters.forEach(param => {
            this.params[param.code] = param.value;
        });
    }

    static createFrom(data) {
        const {id, name, type_id, cargo_turnover, container_turnover} = data;
        const parameters = JSON.parse(data.parameters);
        const lat = data.coordinates.lat;
        const lng = data.coordinates.lng;
        return new this(id, name, type_id, lat, lng, parameters, cargo_turnover, container_turnover);
    }

    prepareParametersForApi() {
        return {
            name: this.name,
            type_id: this.type_id,
            lat: this.lat,
            lng: this.lng,
            parameters: JSON.stringify(this.parameters),
            cargo_turnover: this.cargo_turnover,
            container_turnover: this.container_turnover
        }
    }

    static exportToExcel(elements = []) {
        return this.resource.exportToExcel(elements);
    }

    static importFromExcel(file) {
        return this.resource.importFromExcel(file);
    }

    static massDelete(ids) {
        return this.resource.massDelete(ids);
    }
}