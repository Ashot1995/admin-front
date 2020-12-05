import ActiveRecord from "./ActiveRecord";
import TradeFacilityResource from "../api/resources/trade_facility";

let resource = new TradeFacilityResource();

export default class TradeFacility extends ActiveRecord {

  static resource = resource;
  resource = resource;

  constructor(
    id = null,
    active = false,
    name = '',
    city = {},
    address = '',
    coords = {lat: 0, lng: 0},
    format = '',
    specialization = '',
    status = '',
    estimate = '',
    building = ''
  ) {
    super(id);
    this.name = name;
    this.active = active;
    this.city = city;
    this.address = address;
    this.coords = coords;
    this.format = format;
    this.specialization = specialization;
    this.status = status;
    this.estimate = estimate;
    this.building = building;
  }

  static createFrom(data) {
    const {id, active, name, city, address, coords, format, specialization, status, estimate, building} = data;
    return new this(id, active, name, city, address, coords, format, specialization, status, estimate, building)
  }

  prepareParametersForApi() {
    return {
      name: this.name,
      active: this.active,
      city_id: this.city.id,
      address: this.address,
      lat: this.coords.lat,
      lng: this.coords.lng,
      format: this.format,
      specialization: this.specialization,
      status: this.status,
      estimate: this.estimate,
      building: this.building
    }
  }

  static importFromExcel(file) {
    return this.resource.importFromExcel(file);
  }

  static exportToExcel(ids = []) {
    return this.resource.exportToExcel(ids);
  }

}
