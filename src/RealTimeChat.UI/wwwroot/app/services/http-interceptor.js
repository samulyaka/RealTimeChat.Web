function httpInterceptor($q, $location) {
    var requestCount = 0;
    function updateLoader() {
        var loader = $('#loader'), isVisible = loader.is(":visible");
        if (requestCount > 0 && !isVisible) {
            loader.show();
        }
        else if (requestCount <= 0 && isVisible) {
            loader.hide();
        }
    }
    return {
        request: function (config) {
            requestCount++;
            updateLoader();
            return config;
        },
        responseError: function (rejection) {
            requestCount = 0;
            updateLoader();
            if (rejection.status === 401) {
                $location.path('/login');
                return;
            }
            return $q.reject(rejection);
        },
        response: function (rejection) {
            requestCount--;
            updateLoader();
            return rejection;
        }
    };
}
;
angular
    .module('app')
    .service('baseHttpInterceptor', httpInterceptor);
