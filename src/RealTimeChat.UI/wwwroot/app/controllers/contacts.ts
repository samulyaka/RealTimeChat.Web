class contactsController {
    private contextService: ContextService;
    private pubnubService: pubnubService;
    private scope: any;
    static $inject = ['$scope', 'contextService', 'pubnubService'];
    constructor($scope: any, contextService: ContextService, pubnubService: pubnubService) {
        this.scope = $scope;
        this.contextService = contextService;
        this.pubnubService = pubnubService; $scope.test = "aaa";
        $scope.Context = contextService;
        $scope.Contacts = contextService.Contacts;
        $scope.SelectContact = this.SelectContact.bind(this);
        $scope.$watch("Context.currentUser", function (newValue, ildValue) {
            this.LoadContacts();
        }.bind(this));
        this.LoadContacts();
        $scope.$watch("Context.Contacts", function (newValue, ildValue) {
            this.scope.Contacts = this.contextService.Contacts;
        }.bind(this));
    }
    public LoadContacts(): void {
        var user = this.contextService.GetCurrentUser();
        if (user == null || !user.loginned) {
            return;
        }
        this.contextService.Send("Users", "LoadContacts", null, function (res) {
            for (var i = 0; i < res.data.length; i++) {
                res.data[i].uuid = res.data[i].mail + res.data[i].id;
                this.pubnubService.InitChannel(res.data[i].chatUID, function () { });
            }
            this.contextService.Contacts = res.data;
            if (this.contextService.Contacts.length > 0) {
                var newUUID = new UUIDPupNubModel();
                newUUID.uuid = this.contextService.Contacts[0].chatUID;
                this.contextService.activeChannelUUID = newUUID;
                this.contextService.ActiveContact = this.contextService.Contacts[0];
            }
            this.scope.Contacts = this.contextService.Contacts;
        }.bind(this));
    }
    SelectContact(item: UserModel): void {
        var newUUID = new UUIDPupNubModel();
        newUUID.uuid = item.chatUID;
        this.contextService.activeChannelUUID = newUUID;
        this.contextService.ActiveContact = item; 
    }
}
angular.module("app").controller('contactsController', contactsController);