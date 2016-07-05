class rootController extends baseController {
    constructor($scope: any, $rootScope: any, $http: ng.IHttpService, $location: ng.ILocationService, ngNotify: any, $timeout: ng.ITimeoutService) {
        super($scope, $rootScope, $http, $location, ngNotify);
        $rootScope.currentUser = new LoginUserModel();
        $rootScope.Contacts = [];
        $rootScope.activeChannelUUID = "";
        $rootScope.RefreshUserStatus = function (event) {
        
            if (event['uuid'] === $rootScope.currentUser.uuid) return;

            var user:any = _.find($rootScope.Contacts, { uuid: event['uuid'] });
            if (user == null) {
                return;
            }

            user.online = event['action'] !== 'timeout' && event['action'] !== 'leave';
           
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }
        };

        $scope.$on('$viewContentLoaded', function () {
            $timeout(initThirdPartLibs, 1000);
        });

    }
}
angular.module("app").controller('rootController', rootController);