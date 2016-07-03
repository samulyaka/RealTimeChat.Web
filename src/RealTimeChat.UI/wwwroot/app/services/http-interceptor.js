var httpInterceptor = (function () {
    function httpInterceptor($q, $location) {
        this.q = $q;
        this.location = $location;
    }
    httpInterceptor.prototype.request = function (config) {
        return config;
    };
    httpInterceptor.prototype.responseError = function (rejection) {
        if (rejection.status === 401) {
            console.log('redirect');
            this.location.path('/login');
            return;
        }
        return this.q.reject(rejection);
    };
    httpInterceptor.prototype.response = function (rejection) {
        return rejection;
    };
    httpInterceptor.$inject = ['$q', '$location'];
    return httpInterceptor;
}());
angular
    .module('app')
    .service('baseHttpInterceptor', httpInterceptor);
