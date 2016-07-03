class baseController {
    protected scope: any;
    protected rootScope: any;
    protected http: ng.IHttpService;
    protected location: ng.ILocationService;
    protected GlobalConfig: GlobalConfigModel;
    constructor($scope: any, $rootScope:any, $http: ng.IHttpService, $location: ng.ILocationService) {
        this.scope = $scope;
        this.rootScope = $rootScope;
        this.http = $http;
        this.location = $location;
        this.GlobalConfig = window['GlobalConfig'];
    }
    protected Send(controllerName: string, actionName: string, data: any, callback: (res: any) => void, wrapErrors: boolean = true): void {
        this.http.post(this.BuidUrl(controllerName, actionName), data).then(function (res) {
            if (wrapErrors && res.data.success === false) {
                
                return;
            }
            callback.bind(this)(res.data);
        }.bind(this));
    }
    protected BuidUrl(controllerName, actionName): string{
        return this.GlobalConfig.baseApiUlr + controllerName + "/" + actionName;
    }
}