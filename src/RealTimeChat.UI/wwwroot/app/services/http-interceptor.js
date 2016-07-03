function httpInterceptor($q, $location) {
    return {
        request: function (config) {
            return config;
        },
        responseError: function (rejection) {
            if (rejection.status === 401) {
                $location.path('/login');
                return;
            }
            return $q.reject(rejection);
        },
        response: function (rejection) {
            return rejection;
        }
    };
}
;
angular
    .module('app')
    .service('baseHttpInterceptor', httpInterceptor);
