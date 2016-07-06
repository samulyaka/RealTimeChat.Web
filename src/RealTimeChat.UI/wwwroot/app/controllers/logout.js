var logoutController = (function () {
    function logoutController($scope, contextService) {
        $scope.Context = contextService;
        this.scope = $scope;
        this.contextService = contextService;
    }
    logoutController.prototype.UserLogout = function () {
        this.contextService.LogOut(function (success) {
            this.location.path("/login");
        });
    };
    logoutController.$inject = ['$scope', 'contextService'];
    return logoutController;
}());
angular.module("app").controller('logoutController', logoutController);
