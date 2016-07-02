(function () {
    'use strict';

    angular
        .module('app')
        .factory('baseHttpInterceptor', baseHttpInterceptor);

  //  baseHttpInterceptor.$inject = [$q, $window];

    function baseHttpInterceptor($q, $location) {
 
            var authInterceptorServiceFactory = {};
 
            var _request = function (config) {
 
                console.log(config);
 
                return config;
            }

            var _responseError = function (rejection) {
                if (rejection.status === 401) {
                    console.log('redirect');
                    $location.path('/login');
                    return;
                }
                return $q.reject(rejection);
            }
            var _response = function (rejection) {
                console.log(rejection);
                return rejection;
            }

            authInterceptorServiceFactory.request = _request;
            authInterceptorServiceFactory.response = _response;
            authInterceptorServiceFactory.responseError = _responseError;
 
            return authInterceptorServiceFactory;
        
    }
})();