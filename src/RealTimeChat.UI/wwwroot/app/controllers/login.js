var loginController = (function () {
    function loginController($scope, contextService, $location, pubnubService) {
        $scope.loginFailed = false;
        this.contextService = contextService;
        this.location = $location;
        this.pubnubService = pubnubService;
        this.scope = $scope;
        //testing
        this.pubnubService.CloseAllChannels();
    }
    loginController.prototype.UserLogin = function () {
        this.contextService.UserLogin(this.scope.UserName, this.scope.Password, function (success) {
            if (success) {
                this.location.path("/home");
            }
            else {
                this.scope.loginFailed = true;
            }
        }.bind(this));
    };
    loginController.$inject = ['$scope', 'contextService', '$location', 'pubnubService'];
    return loginController;
}());
angular.module("app").controller('loginController', loginController);
