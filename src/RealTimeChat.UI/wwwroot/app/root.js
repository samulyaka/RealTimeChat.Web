var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var rootController = (function (_super) {
    __extends(rootController, _super);
    function rootController($scope, $rootScope, $http, $location, ngNotify) {
        _super.call(this, $scope, $rootScope, $http, $location, ngNotify);
        $rootScope.currentUser = new LoginUserModel();
        $rootScope.Contacts = [];
        $rootScope.activeChannelUUID = "";
        $rootScope.RefreshUserStatus = function (event) {
            if (event['uuid'] === $rootScope.currentUser.uuid)
                return;
            var user = _.find($rootScope.Contacts, { uuid: event['uuid'] });
            if (user == null) {
                return;
            }
            user.online = event['action'] !== 'timeout' && event['action'] !== 'leave';
            $rootScope.$digest();
        };
    }
    return rootController;
}(baseController));
angular.module("app").controller('rootController', rootController);
