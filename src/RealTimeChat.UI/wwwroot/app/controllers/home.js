var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var homeController = (function (_super) {
    __extends(homeController, _super);
    function homeController($scope, $rootScope, $http, $location, pubnubService, ngNotify) {
        _super.call(this, $scope, $rootScope, $http, $location, ngNotify);
        this.pubnubService = pubnubService;
        this.Init();
    }
    homeController.prototype.Init = function () {
        var user = this.GetCurrentUser();
        if (!user.loginned) {
            this.Send("Account", "LoadUserInfo", null, function (res) {
                if (res.success) {
                    res.data.loginned = true;
                    this.SetCurrentUser(res.data);
                    this.pubnubService.Init(res.data);
                    return false;
                }
                else {
                    this.location.path("/login");
                }
            });
            return;
        }
        this.pubnubService.Init(user);
    };
    return homeController;
}(baseController));
angular.module("app").controller('homeController', homeController);
