class contactsController extends baseController {
    private pubnubService: pubnubService;
    public Contacts: any;
    constructor($scope: any, $rootScope: any, $http: ng.IHttpService, $location: ng.ILocationService, pubnubService: pubnubService, ngNotify: any) {
        super($scope, $rootScope, $http, $location, ngNotify);
        this.pubnubService = pubnubService;
        this.scope.Contacts = [];
        this.scope.SelectContact = this.SelectContact.bind(this);
        this.LoadContacts();
        this.scope.$root.$watch("Contacts", function (newValue, oldValue) {
            this.scope.Contacts = newValue;
        }.bind(this));
    }
    LoadContacts(): void {
        this.Send("Users", "LoadContacts", null, function (res) {
            for (var i = 0; i < res.data.length; i++) {
                res.data[i].uuid = res.data[i].mail + res.data[i].id;
            }
            this.scope.$root.Contacts = res.data;
            if (this.scope.$root.Contacts.length > 0) {
                this.scope.$root.activeChannelUUID = this.scope.$root.Contacts[0].chatUID;
                this.scope.$root.ActiveContact = this.scope.$root.Contacts[0];
                console.log("change");
            }
        });
    }
    SelectContact(item: any): void {
        console.log(item.chatUID);
        console.log(this.scope);
        this.scope.$root.ActiveContact = item;
        this.scope.$root.activeChannelUUID = item.chatUID;
    }

}
angular.module("app").controller('contactsController', contactsController);