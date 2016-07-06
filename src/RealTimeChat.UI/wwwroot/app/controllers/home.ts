class homeController {
    private pubnubService: pubnubService;
    private contextService: ContextService;
    private location: ng.ILocationService;
    private scope: any;
    static $inject = ['$scope','contextService', '$location', 'pubnubService'];
    constructor($scope:any, contextService: ContextService, $location: ng.ILocationService, pubnubService: pubnubService) {
        this.pubnubService = pubnubService;
        this.contextService = contextService;
        this.location = $location;
        this.scope = $scope;
        this.scope.context = this.contextService;
        this.Init();
    }
    private Init() {
        var user = this.contextService.GetCurrentUser();
        if (user == null || !user.loginned) {
            this.contextService.Send("Account", "LoadUserInfo", null, function (res) {
                if (res.success) {
                    res.data.loginned = true;
                    this.contextService.SetCurrentUser(res.data);
                    this.pubnubService.Init(res.data);
                    return false;
                } else {
                    this.location.path("/login");
                }
            }.bind(this));
            return;
        }
        this.pubnubService.Init(user);
    }
    
}
angular.module("app").controller('homeController', homeController);