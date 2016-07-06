var rootController = (function () {
    function rootController($scope, $rootScope, $http, $location, ngNotify, $timeout) {
        $scope.$on('$viewContentLoaded', function () {
            $timeout(window['initThirdPartLibs'], 1000);
        });
    }
    return rootController;
}());
angular.module("app").controller('rootController', rootController);
