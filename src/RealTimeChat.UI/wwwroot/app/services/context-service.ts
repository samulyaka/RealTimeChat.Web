class LoginUserModel {
    id: number = 0;
    name: string = "";
    mail: string = "";
    imageUrl: string = "";
    info: string = "";
    loginned: boolean = false;
    uuid: string;
}
class UUIDPupNubModel {
    uuid: string;
    id: string;
}

class UserModel {
    public id: number;
    public userName: string;
    public mail: string;
    public chatUID: string;
    public info: string;
    public imageUrl: string;
    public uuid: string;
    public lastMessageDate: Date;
}
class ContextService {
    protected ngNotify: any;
    protected $rootScope: any;
    protected http: ng.IHttpService;
    protected GlobalConfig: GlobalConfigModel;
    public currentUser: LoginUserModel;
    public activeChannelUUID: UUIDPupNubModel; 
    public Contacts: Array<UserModel>;
    public ActiveContact: UserModel;
    static $inject = ['$rootScope', '$http', 'ngNotify'];
    constructor($rootScope:any, $http: ng.IHttpService, ngNotify: any) {
        this.http = $http;
        this.ngNotify = ngNotify;
        this.$rootScope = $rootScope;
        this.GlobalConfig = window['GlobalConfig'];
    }
    public UserLogin(mail: string, password: string, callback: (success: boolean) => void): void {
        this.Send("Account", "login", { Email: mail, Password: password }, function (res) {
            if (res.success) {
                res.data.loginned = true;
                this.SetCurrentUser(res.data);
                callback(true);
                return;
            }
            callback(false);
        }.bind(this), false);
    }
    public LogOut(callback: (success: boolean) => void) {
        this.Send("Account", "logout", {}, function (res) {
            if (res.success) {
                this.currentUser = null;
            }
            callback(res.success);
        }.bind(this));
    }
    public Send(controllerName: string, actionName: string, data: any, callback: (res: any) => void, wrapErrors: boolean = true): void {
        this.http.post(this.BuidUrl(controllerName, actionName), data).then(function (res) {
            if (wrapErrors && res.data.success === false) {
                this.ngNotify.set(res.data.message, {
                    type: 'error',
                    sticky: true,
                    button: true,
                });
                return;
            }
            callback(res.data);
        }.bind(this));
    }
    
    public SetCurrentUser(user: LoginUserModel): void {
        this.currentUser = user;
        this.currentUser.uuid = user.mail + user.id;
    }
    public GetCurrentUser(): LoginUserModel {
        return this.currentUser;
    }
    public RefreshUserStatus = function (event) {

        if (event['uuid'] === this.currentUser.uuid) return;

        var user: any = _.find(this.Contacts, { uuid: event['uuid'] });
        if (user == null) {
            return;
        }

        user.online = event['action'] !== 'timeout' && event['action'] !== 'leave';

        if (this.$rootScope.$$phase != '$apply' && this.$rootScope.$$phase != '$digest') {
            this.$rootScope.$apply();
        }
    };
    public BuidUrl(controllerName, actionName, args?): string {
        var strPath: string = this.GlobalConfig.baseApiUlr + controllerName + "/" + actionName;
        if (args) {
            var params = [];
            for (var paramName in args) {
                params.push(paramName + "=" + args[paramName]);
            }
            strPath += "?" + params.join("&");
        }
        return strPath;
    }
}
angular
    .module('app')
    .service('contextService', ContextService);