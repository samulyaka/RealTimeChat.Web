var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var contactsController = (function (_super) {
    __extends(contactsController, _super);
    function contactsController($scope, $rootScope, $http, $location, pubnubService) {
        _super.call(this, $scope, $rootScope, $http, $location);
        this.pubnubService = pubnubService;
        console.log('contacts');
    }
    return contactsController;
}(baseController));
angular.module("app").controller('contactsController', contactsController);
