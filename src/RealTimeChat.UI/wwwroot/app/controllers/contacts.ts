class contactsController extends baseController {
    private pubnubService: pubnubService;
    public Contacts: any;
    constructor($scope: any, $rootScope: any, $http: ng.IHttpService, $location: ng.ILocationService, pubnubService: pubnubService, ngNotify: any) {
        super($scope, $rootScope, $http, $location, ngNotify);
        this.pubnubService = pubnubService;
        this.scope.Contacts = [];
        this.scope.SelectContact = this.SelectContact.bind(this);
        this.LoadContacts();
    }
    LoadContacts(): void {
        this.Send("Users", "LoadContacts", null, function (res) {
            this.scope.Contacts = res.data;
            if (this.scope.Contacts.length > 0) {
                this.GetCurrentUser().activeChannelUUID = this.scope.Contacts[0].chatUID;
            }
        });
    }
    SelectContact(item: any): void {
        console.log(item.chatUID);
        console.log(this.scope);
        this.rootScope.activeChannelUUID = item.chatUID;
    }

}
angular.module("app").controller('contactsController', contactsController);