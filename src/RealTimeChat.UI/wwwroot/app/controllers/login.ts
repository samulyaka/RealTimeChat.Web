class loginController extends baseController {
    pubnubService: any;
    constructor($scope: any, $rootScope: any, $http: ng.IHttpService, $location: ng.ILocationService, ngNotify: any, pubnubService: pubnubService) {
        super($scope, $rootScope, $http, $location, ngNotify);
        $scope.loginFailed = false;
        this.pubnubService = pubnubService;
        //testing
        this.pubnubService.CloseAllChannels();
    }

    public UserLogin() {
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
    }
}
angular.module("app").controller('loginController', loginController);