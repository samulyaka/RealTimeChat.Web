class loginController extends baseController {
    constructor($scope: any, $rootScope: any, $http: ng.IHttpService, $location: ng.ILocationService) {
        super($scope, $rootScope, $http, $location);
        $scope.loginFailed = false;
        //testing
        $scope.UserName = 'samulyak.a@gmail.com';
        $scope.Password = '123';
    }

    public UserLogin() {
        this.Send("Account", "login", { Email: this.scope.UserName, Password: this.scope.Password }, function (res) {
            if (res.success) {
                res.data.loginned = true;
                this.rootScope.currentUser = res.data;
                this.location.path("/home");
                return false;
            }
            this.scope.loginFailed = true;
            return false;
        }, false);
    }
}
angular.module("app").controller('loginController', loginController);