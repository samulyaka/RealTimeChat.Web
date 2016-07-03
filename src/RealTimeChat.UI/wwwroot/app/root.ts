class rootController extends baseController {
    constructor($scope: any, $rootScope: any, $http: ng.IHttpService, $location: ng.ILocationService) {
        super($scope, $rootScope, $http, $location);
        $rootScope.currentUser = {
            id: 0,
            name: "",
            mail: "",
            imageUrl: "",
            info: "",
            loginned: false
        };
    }
}
angular.module("app").controller('rootController', rootController);