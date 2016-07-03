class contactsController extends baseController {
    private pubnubService: pubnubService;
    public Contacts: any;
    constructor($scope: any, $rootScope: any, $http: ng.IHttpService, $location: ng.ILocationService, pubnubService: pubnubService, ngNotify: any) {
        super($scope, $rootScope, $http, $location, ngNotify);
        this.pubnubService = pubnubService;
        this.LoadContacts();
    }
    LoadContacts(): void {
        this.Send("Users", "LoadContacts", null, function (res) {
            this.Contacts = res.data;
            if (this.Contacts.length > 0) {
                this.GetCurrentUser().activeChannelUUID = this.Contacts[0].chatUID;
            }
        });
    }
    SelectContact(item: any): void {
        this.GetCurrentUser().activeChannelUUID = item.chatUID;
    }

}
angular.module("app").controller('contactsController', contactsController);