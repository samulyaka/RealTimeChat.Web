class loginController {
    private scope: any;
    private location: ng.ILocationService;
    private contextService: ContextService;
    private pubnubService: pubnubService;
    static $inject = ['$scope', 'contextService', '$location', 'pubnubService'];
    constructor($scope: any, contextService: ContextService, $location: ng.ILocationService, pubnubService: pubnubService) {
        $scope.loginFailed = false;
        this.contextService = contextService;
        this.location = $location;
        this.pubnubService = pubnubService;
        this.scope = $scope;
        //testing
        this.pubnubService.CloseAllChannels();
    }

    public UserLogin() {
        this.contextService.UserLogin(this.scope.UserName, this.scope.Password, function (success) {
            if (success){
                this.location.path("/home");
            } else {
                this.scope.loginFailed = true;
            }
        }.bind(this)); 
    }
}
angular.module("app").controller('loginController', loginController);