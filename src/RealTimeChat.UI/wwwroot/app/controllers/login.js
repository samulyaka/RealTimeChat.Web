var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var loginController = (function (_super) {
    __extends(loginController, _super);
    function loginController($scope, $rootScope, $http, $location, ngNotify, pubnubService) {
        _super.call(this, $scope, $rootScope, $http, $location, ngNotify);
        $scope.loginFailed = false;
        this.pubnubService = pubnubService;
        //testing
        this.pubnubService.CloseAllChannels();
    }
    loginController.prototype.UserLogin = function () {
        this.Send("Account", "login", { Email: this.scope.UserName, Password: this.scope.Password }, function (res) {
            if (res.success) {
                res.data.loginned = true;
                this.SetCurrentUser(res.data);
                this.location.path("/home");
                return false;
            }
            this.scope.loginFailed = true;
            return false;
        }, false);
    };
    return loginController;
}(baseController));
angular.module("app").controller('loginController', loginController);
