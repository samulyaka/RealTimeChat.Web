(function () {
    'use strict';

    angular
        .module('app')
        .controller('rootController', rootController);

    rootController.$inject = ['$scope', '$http'];

    function rootController($scope, $http) {
        $scope.currentUser = {
            id: 0,
            name: "",
            mail: "",
            imageUrl: "",
            info: "",
            loginned: false
        };
    }
})();
