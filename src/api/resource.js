import Request from './request';

const routes = {
    index: '',
    show: '',
    store: '',
    update: '',
    delete: ''
};

export default {

    index(parameters) {
        let request = new Request('get', routes.index, parameters);

        return request.getResponse();
    },

    show(id, parameters) {
        let request = new Request('get', routes.show + '/' + id, parameters);

        return request.getResponse();
    },

    store(data) {
        let request = new Request('post', routes.store, data);

        return request.getResponse();
    },

    update(id, data) {
        let request = new Request('put', routes.update + '/' + id, data);

        return request.getResponse();
    },

    destroy(id) {
        let request = new Request('delete', routes.delete + '/' + id);

        return request.getResponse();
    }

}

