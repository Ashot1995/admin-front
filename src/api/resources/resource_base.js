import Request from '../request';

export default class ResourceBase {

    resourceRoute = '';

    index(parameters) {
        let request = new Request('get', this.resourceRoute, parameters);

        return request.getResponse();
    }

    show(id, parameters) {
        let request = new Request('get', this.resourceRoute + '/' + id, parameters);

        return request.getResponse();
    }

    store(data) {
        let request = new Request('post', this.resourceRoute, data);

        return request.getResponse();
    }

    update(id, data) {
        let request = new Request('put', this.resourceRoute + '/' + id, data);

        return request.getResponse();
    }

    destroy(id) {
        let request = new Request('delete', this.resourceRoute + '/' + id);

        return request.getResponse();
    }

}

