class logoutController {
    private scope: any;
    private contextService: ContextService;
    static $inject = ['$scope', 'contextService'];
    constructor($scope: any, contextService: ContextService) {
        $scope.Context = contextService;
        this.scope = $scope;
        this.contextService = contextService;
    }

    public UserLogout() {
        this.contextService.LogOut(function (success) {
            this.location.path("/login");
        });
    }
}
angular.module("app").controller('logoutController', logoutController);