class LoginUserModel {
    id: number = 0;
    name: string = "";
    mail: string = "";
    imageUrl: string = "";
    info: string = "";
    loginned: boolean = false;
    uuid: string;
}
class baseController {
    protected scope: any;
    protected ngNotify: any;
    protected rootScope: any;
    protected http: ng.IHttpService;
    protected location: ng.ILocationService;
    protected GlobalConfig: GlobalConfigModel;
    constructor($scope: any, $rootScope: any, $http: ng.IHttpService, $location: ng.ILocationService, ngNotify:any) {
        this.scope = $scope;
        this.rootScope = $rootScope;
        this.http = $http;
        this.location = $location;
        this.ngNotify = ngNotify;
        this.GlobalConfig = window['GlobalConfig'];
    }
    protected Send(controllerName: string, actionName: string, data: any, callback: (res: any) => void, wrapErrors: boolean = true): void {
        this.http.post(this.BuidUrl(controllerName, actionName), data).then(function (res) {
            if (wrapErrors && res.data.success === false) {
                this.ngNotify.set(res.data.message, {
                        type: 'error',
                        sticky: true,
                        button: false,
                    });
                return;
            }
            callback.bind(this)(res.data);
        }.bind(this));
    }
    protected SetCurrentUser(user: LoginUserModel): void  {
        this.rootScope.currentUser = user;
        this.rootScope.currentUser.uuid = user.mail + user.id;
        this.rootScope.currentUser.activeChannelUUID = '';
    }
    protected GetCurrentUser(): LoginUserModel {
        return this.rootScope.currentUser;
    }
    protected BuidUrl(controllerName, actionName): string{
        return this.GlobalConfig.baseApiUlr + controllerName + "/" + actionName;
    }
}