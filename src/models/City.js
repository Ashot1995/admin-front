import ActiveRecord from "./ActiveRecord";
import CityResource from "../api/resources/city";

let resource = new CityResource();

export default class City extends ActiveRecord {

  static resource = resource;
  resource = resource;

  constructor(
    id = null,
    name = '',
    coords = {lat: 0, lng: 0}
  ) {
    super(id);
    this.name = name;
    this.coords = coords;
  }

  static createFrom(data) {
    const {id, name, coords} = data;
    return new this(id, name, coords);
  }
}
