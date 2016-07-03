class rootController extends baseController {
    constructor($scope: any, $rootScope: any, $http: ng.IHttpService, $location: ng.ILocationService) {
        super($scope, $rootScope, $http, $location);
        $rootScope.currentUser = new LoginUserModel();
    }
}
angular.module("app").controller('rootController', rootController);