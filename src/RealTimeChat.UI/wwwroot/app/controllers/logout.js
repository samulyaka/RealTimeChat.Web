var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var logoutController = (function (_super) {
    __extends(logoutController, _super);
    function logoutController($scope, $rootScope, $http, $location) {
        _super.call(this, $scope, $rootScope, $http, $location);
        console.log(this.rootScope.currentUser);
        $scope.UserName = this.rootScope.currentUser.name;
    }
    logoutController.prototype.UserLogout = function () {
        this.Send("Account", "logout", {}, function (res) {
            if (res.success) {
                this.rootScope.currentUser = null;
                this.location.path("/login");
                return false;
            }
            return false;
        }, false);
    };
    return logoutController;
}(baseController));
angular.module("app").controller('logoutController', logoutController);
