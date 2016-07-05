(function () {
    'use strict';
    //,"pubnub.angular.service"
    angular.module('app', ["ngRoute", "pubnub.angular.service", 'ngFileUpload', 'ngNotify']).config(function ($routeProvider, $httpProvider) {

        $routeProvider.when('/login',
        {
            templateUrl: window["GlobalConfig"].baseUrl + 'app/views/login.html'
        });
        $routeProvider.when('/home',
        {
            templateUrl: window["GlobalConfig"].baseUrl + 'app/views/main-layout.html'
        });
       
        $routeProvider.otherwise({ redirectTo: '/home' });
        $httpProvider.interceptors.push('baseHttpInterceptor');
    }).run(['ngNotify', function (ngNotify) {

      ngNotify.config({
          theme: 'paster',
          position: 'top',
          duration: 250
      });

  }]);;
})();