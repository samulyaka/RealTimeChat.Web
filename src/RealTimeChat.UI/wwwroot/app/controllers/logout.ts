class logoutController extends baseController {
    constructor($scope: any, $rootScope: any, $http: ng.IHttpService, $location: ng.ILocationService) {
        super($scope, $rootScope, $http, $location);
        console.log(this.rootScope.currentUser)
        $scope.UserName = this.rootScope.currentUser.name;
    }

    public UserLogout() {
        this.Send("Account", "logout", { }, function (res) {
            if (res.success) {
                this.rootScope.currentUser = null;
                this.location.path("/login");
                return false;
            }
            return false;
        }, false);
    }
}
angular.module("app").controller('logoutController', logoutController);