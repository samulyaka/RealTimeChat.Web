class homeController extends baseController {
    private pubnubService: pubnubService;
    constructor($scope: any, $rootScope: any, $http: ng.IHttpService, $location: ng.ILocationService, pubnubService: pubnubService, ngNotify: any) {
        super($scope, $rootScope, $http, $location, ngNotify);
        this.pubnubService = pubnubService;
        this.Init();
    }
    private Init() {
        var user = this.GetCurrentUser();
        if (!user.loginned) {
            this.Send("Account", "LoadUserInfo", null, function (res) {
                if (res.success) {
                    res.data.loginned = true;
                    this.SetCurrentUser(res.data);
                    this.pubnubService.Init(res.data);
                    return false;
                } else {
                    this.location.path("/login");
                }
            });
            return;
        }
        this.pubnubService.Init(user);
    }
    
}
angular.module("app").controller('homeController', homeController);