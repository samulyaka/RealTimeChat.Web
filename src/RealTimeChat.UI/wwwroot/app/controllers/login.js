(function () {
    'use strict';

    angular
        .module('app')
        .controller('loginController', loginController);

    loginController.$inject = ['$scope'];

    function loginController($scope) {
        $scope.title = 'login';

        activate();

        function activate() { }
    }
})();
