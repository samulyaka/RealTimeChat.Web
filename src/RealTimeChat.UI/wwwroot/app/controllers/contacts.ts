class contactsController extends baseController {
    private pubnubService: pubnubService;
    public Contacts: any;
    constructor($scope: any, $rootScope: any, $http: ng.IHttpService, $location: ng.ILocationService, pubnubService: pubnubService) {
        super($scope, $rootScope, $http, $location);
        this.pubnubService = pubnubService;
        this.LoadContacts();
    }
    LoadContacts(): void {
        this.Send("Users", "LoadContacts", null, function (res) {
            this.Contacts = res.data;
            console.log(this.Contacts);
        });
    }

}
angular.module("app").controller('contactsController', contactsController);