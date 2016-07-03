var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var contactsController = (function (_super) {
    __extends(contactsController, _super);
    function contactsController($scope, $rootScope, $http, $location, pubnubService, ngNotify) {
        _super.call(this, $scope, $rootScope, $http, $location, ngNotify);
        this.pubnubService = pubnubService;
        this.scope.Contacts = [];
        this.scope.SelectContact = this.SelectContact.bind(this);
        this.LoadContacts();
    }
    contactsController.prototype.LoadContacts = function () {
        this.Send("Users", "LoadContacts", null, function (res) {
            this.scope.Contacts = res.data;
            if (this.scope.Contacts.length > 0) {
                this.GetCurrentUser().activeChannelUUID = this.scope.Contacts[0].chatUID;
            }
        });
    };
    contactsController.prototype.SelectContact = function (item) {
        console.log(item.chatUID);
        console.log(this.scope);
        this.rootScope.activeChannelUUID = item.chatUID;
    };
    return contactsController;
}(baseController));
angular.module("app").controller('contactsController', contactsController);
