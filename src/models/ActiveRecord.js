export default class ActiveRecord {

    static resource = {};
    resource = {};

    constructor(id) {
        this.id = id;
    }

    save() {
        let promise;

        if(this.id === null) {
            promise = this.resource.store(this.prepareParametersForApi())
        } else {
            promise = this.resource.update(this.id, this.prepareParametersForApi())
        }

        promise
            .then((promise) => {
                return promise;
            })
            .catch((error) => {
                console.error(error)
            })

        return promise;
    }

    delete() {
        if(this.id > 1) {
            let promise = this.resource.destroy(this.id)
                .then((promise) => {
                    return promise;
                })
                .catch((error) => {
                    console.error(error)
                })

            return promise;
        }
    }

    static index(parameters){

        let promise = this.resource.index(parameters)
            .then((response) => {
                let items = response.data.data.map((item) => {
                    return this.createFrom(item)
                });
                return {
                    items: items,
                    filters: !!response.data.filters ? response.data.filters : [],
                    pagination: response.data.pagination
                }
            })
            .catch((error) => {
                console.error(error)
            });

        return promise;
    }

    static getById(id) {
        let promise = this.resource.show(id, {})
            .then((promise) => {
                return this.createFrom(promise.data);
            })
            .catch((error) => {
                console.error(error);
            });

        return promise;
    }

}
