(function () {
    'use strict';
    //,"pubnub.angular.service"
    angular.module('app', ["ngRoute"]).config(function ($routeProvider, $httpProvider) {

        $routeProvider.when('/login',
        {
            templateUrl: 'app/views/login.html',
            controller: 'loginController'
        });
        $routeProvider.when('/home/:id',
        {
            templateUrl: 'app/views/main-layout.html',
            controller: 'homeController'
        });
       
        $routeProvider.otherwise({ redirectTo: '/home' });
        console.log($httpProvider);
        $httpProvider.interceptors.push('baseHttpInterceptor');
    });
})();