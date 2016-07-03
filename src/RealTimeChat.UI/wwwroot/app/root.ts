class rootController extends baseController {
    constructor($scope: any, $rootScope: any, $http: ng.IHttpService, $location: ng.ILocationService, ngNotify: any) {
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
           
            $rootScope.$digest();
        };
    }
}
angular.module("app").controller('rootController', rootController);