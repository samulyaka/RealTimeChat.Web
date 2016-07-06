class rootController  {
    constructor($scope: any, $rootScope: any, $http: ng.IHttpService, $location: ng.ILocationService, ngNotify: any, $timeout: ng.ITimeoutService) {

       

        $scope.$on('$viewContentLoaded', function () {
            $timeout(window['initThirdPartLibs'], 1000);
        });

    }
}
angular.module("app").controller('rootController', rootController);