(function () {
    'use strict';

    angular.module('app', [
        // Angular modules 
        'ngRoute'

        // Custom modules 

        // 3rd Party Modules
        
    ]).config(function ($routeProvider) {

        $routeProvider.when('/login',
        {
            templateUrl: 'App/views/login.html',
            controller: 'loginController'
        });
        $routeProvider.when('/chat/:id',
        {
            templateUrl: 'views/question.html',
            controller: 'QuestionController'
        });
       
        $routeProvider.otherwise({redirectTo: '/login'});
    });
})();
console.log('aaa!');