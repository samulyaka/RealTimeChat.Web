class homeController extends baseController {
    private pubnubService: pubnubService;
    constructor($scope: any, $rootScope: any, $http: ng.IHttpService, $location: ng.ILocationService, pubnubService: pubnubService) {
        super($scope, $rootScope, $http, $location);
        this.pubnubService = pubnubService;
        this.pubnubService.hello();
    }
    
}
angular.module("app").controller('homeController', homeController);