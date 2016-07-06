var homeController = (function () {
    function homeController($scope, contextService, $location, pubnubService) {
        this.pubnubService = pubnubService;
        this.contextService = contextService;
        this.location = $location;
        this.scope = $scope;
        this.scope.context = this.contextService;
        this.Init();
    }
    homeController.prototype.Init = function () {
        var user = this.contextService.GetCurrentUser();
        if (user == null || !user.loginned) {
            this.contextService.Send("Account", "LoadUserInfo", null, function (res) {
                if (res.success) {
                    res.data.loginned = true;
                    this.contextService.SetCurrentUser(res.data);
                    this.pubnubService.Init(res.data);
                    return false;
                }
                else {
                    this.location.path("/login");
                }
            }.bind(this));
            return;
        }
        this.pubnubService.Init(user);
    };
    homeController.$inject = ['$scope', 'contextService', '$location', 'pubnubService'];
    return homeController;
}());
angular.module("app").controller('homeController', homeController);
