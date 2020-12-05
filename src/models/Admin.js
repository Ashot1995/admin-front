import ActiveRecord from "./ActiveRecord";
import AdminResource from "../api/resources/admin";

let resource = new AdminResource();

export default class Admin extends ActiveRecord {

    static resource = resource;
    resource = resource;

    constructor(id = null, name = '', email = '', active = true, created = '', updated = '') {
        super(id);
        this.name = name;
        this.email = email;
        this.active = active;
        this.created = created;
        this.updated = updated;
        this.password = '';
        this.confirm = '';
    }

    static createFrom(data) {
        const {id, name, email, active} = data;
        const created = Admin.parseDate(data.created_at);
        const updated = Admin.parseDate(data.updated_at);
        return new this(id, name, email, active, created, updated);
    }

    prepareParametersForApi() {
        let data = {
            name: this.name,
            email: this.email,
            active: this.active
        };

        if(this.password.length > 0 && this.password === this.confirm)
            data.password = this.password;

        return data;
    }

    static parseDate(date) {
        let matches = date.match(/(\d+)-(\d+)-(\d+)T(\d+):(\d+):(\d+)/);
        return new Date(matches[1], parseInt(matches[2]) - 1, matches[3], matches[4], matches[5], matches[6]);
    }

}