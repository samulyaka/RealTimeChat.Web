class logoutController extends baseController {
    constructor($scope: any, $rootScope: any, $http: ng.IHttpService, $location: ng.ILocationService, ngNotify: any) {
        super($scope, $rootScope, $http, $location, ngNotify);
        $rootScope.$watch("currentUser", function (newValue, oldValue) {
            $scope.UserName = $rootScope.currentUser.name;
        }.bind(this));
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