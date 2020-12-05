import ActiveRecord from "./ActiveRecord";
import LogisticFacilityTypeResource from "../api/resources/logistic_facility_type";

let resource = new LogisticFacilityTypeResource();

export default class LogisticFacilityType extends ActiveRecord {

    static resource = resource;
    resource = resource;

    constructor(id = null, name = '', zoom = 0, pin_id = 0, parameters = []) {
        super(id);
        this.name = name;
        this.zoom = zoom;
        this.pin_id = pin_id;
        this.parameters = parameters;
    }

    static createFrom(data) {
        const {id, name, zoom, pin_id} = data;
        const parameters = JSON.parse(data.parameters);
        return new this(id, name, zoom, pin_id, parameters);
    }

    prepareParametersForApi() {
        return {
            name: this.name,
            zoom: this.zoom,
            parameters: JSON.stringify(this.parameters)
        }
    }

}
