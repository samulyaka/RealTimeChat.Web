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
        this.scope.$root.$watch("Contacts", function (newValue, oldValue) {
            this.scope.Contacts = newValue;
        }.bind(this));
    }
    contactsController.prototype.LoadContacts = function () {
        this.Send("Users", "LoadContacts", null, function (res) {
            for (var i = 0; i < res.data.length; i++) {
                res.data[i].uuid = res.data[i].mail + res.data[i].id;
            }
            this.scope.$root.Contacts = res.data;
            if (this.scope.$root.Contacts.length > 0) {
                this.scope.$root.activeChannelUUID = this.scope.$root.Contacts[0].chatUID;
                this.scope.$root.ActiveContact = this.scope.$root.Contacts[0];
            }
        });
    };
    contactsController.prototype.SelectContact = function (item) {
        console.log(item.chatUID);
        console.log(this.scope);
        this.scope.$root.ActiveContact = item;
        this.scope.$root.activeChannelUUID = item.chatUID;
    };
    return contactsController;
}(baseController));
angular.module("app").controller('contactsController', contactsController);
