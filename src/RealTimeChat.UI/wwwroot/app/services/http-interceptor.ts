class httpInterceptor {
    protected q: any;
    protected location: ng.ILocationService;
    static $inject = ['$q','$location'];
    constructor($q:any, $location: ng.ILocationService) {
        this.q = $q;
        this.location = $location;
    }

    public request(config) {

        return config;
    }

    public responseError(rejection) {
        if (rejection.status === 401) {
            console.log('redirect');
            this.location.path('/login');
            return;
        }
        return this.q.reject(rejection);
    }
    public response(rejection) {
        return rejection;
    }
}

angular
    .module('app')
    .service('baseHttpInterceptor', httpInterceptor);