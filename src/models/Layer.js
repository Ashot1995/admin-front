import ActiveRecord from './ActiveRecord'
import LayerResource from '../api/resources/layer'

const resource = new LayerResource()

export default class Layer extends ActiveRecord {
    static resource = resource;
    resource = resource;

    constructor (id = null, name = '', logistic_facility_types_id = []) {
      super(id)
      this.name = name
      this.logistic_facility_types_id = logistic_facility_types_id
    }

    static createFrom (data) {
      const { id, name,  logistic_facility_types_id} = data
      return new this(id, name,logistic_facility_types_id)
    }

    prepareParametersForApi () {
      return {
        name: this.name,
        logistic_facility_types_id: JSON.stringify(this.logistic_facility_types_id)
      }
    }
}
