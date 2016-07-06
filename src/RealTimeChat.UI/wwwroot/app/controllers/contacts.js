var contactsController = (function () {
    function contactsController($scope, contextService, pubnubService) {
        this.scope = $scope;
        this.contextService = contextService;
        this.pubnubService = pubnubService;
        $scope.test = "aaa";
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
    contactsController.prototype.LoadContacts = function () {
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
            if (this.scope.$root.$$phase != '$apply' && this.scope.$root.$$phase != '$digest') {
                this.scope.$root.$apply();
            }
        }.bind(this));
    };
    contactsController.prototype.SelectContact = function (item) {
        var newUUID = new UUIDPupNubModel();
        newUUID.uuid = item.chatUID;
        this.contextService.activeChannelUUID = newUUID;
        this.contextService.ActiveContact = item;
        window['initThirdPartLibs']();
        if (this.scope.$root.$$phase != '$apply' && this.scope.$root.$$phase != '$digest') {
            this.scope.$root.$apply();
        }
        setTimeout(function () {
            window['initThirdPartLibs']();
        }, 500);
    };
    contactsController.$inject = ['$scope', 'contextService', 'pubnubService'];
    return contactsController;
}());
angular.module("app").controller('contactsController', contactsController);
