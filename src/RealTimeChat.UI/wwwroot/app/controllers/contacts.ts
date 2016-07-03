class contactsController extends baseController {
    private pubnubService: pubnubService;
    constructor($scope: any, $rootScope: any, $http: ng.IHttpService, $location: ng.ILocationService, pubnubService: pubnubService) {
        super($scope, $rootScope, $http, $location);
        this.pubnubService = pubnubService;
        console.log('contacts');
    }

}
angular.module("app").controller('contactsController', contactsController);