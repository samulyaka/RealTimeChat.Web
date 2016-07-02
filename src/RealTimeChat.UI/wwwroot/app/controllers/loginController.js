(function () {
    'use strict';

    angular
        .module('app')
        .controller('loginController', loginController);

    loginController.$inject = ['$scope'];

    function loginController($scope) {
        $scope.title = 'loginController';
        $scope.UserName = 'qwe';
        $scope.UserName = 'Password';
        activate();
     /*   this.UserLogin = function () {
            alert('aaa!');
        }*/
        function activate() { }
    }
})();
