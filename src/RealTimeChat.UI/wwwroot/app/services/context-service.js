var LoginUserModel = (function () {
    function LoginUserModel() {
        this.id = 0;
        this.name = "";
        this.mail = "";
        this.imageUrl = "";
        this.info = "";
        this.loginned = false;
    }
    return LoginUserModel;
}());
var UUIDPupNubModel = (function () {
    function UUIDPupNubModel() {
    }
    return UUIDPupNubModel;
}());
var UserModel = (function () {
    function UserModel() {
    }
    return UserModel;
}());
var ContextService = (function () {
    function ContextService($rootScope, $http, ngNotify) {
        this.RefreshUserStatus = function (event) {
            if (event['uuid'] === this.currentUser.uuid)
                return;
            var user = _.find(this.Contacts, { uuid: event['uuid'] });
            if (user == null) {
                return;
            }
            user.online = event['action'] !== 'timeout' && event['action'] !== 'leave';
            if (this.$rootScope.$$phase != '$apply' && this.$rootScope.$$phase != '$digest') {
                this.$rootScope.$apply();
            }
        };
        this.http = $http;
        this.ngNotify = ngNotify;
        this.$rootScope = $rootScope;
        this.GlobalConfig = window['GlobalConfig'];
    }
    ContextService.prototype.UserLogin = function (mail, password, callback) {
        this.Send("Account", "login", { Email: mail, Password: password }, function (res) {
            if (res.success) {
                res.data.loginned = true;
                this.SetCurrentUser(res.data);
                callback(true);
                return;
            }
            callback(false);
        }.bind(this), false);
    };
    ContextService.prototype.LogOut = function (callback) {
        this.Send("Account", "logout", {}, function (res) {
            if (res.success) {
                this.currentUser = null;
            }
            callback(res.success);
        }.bind(this));
    };
    ContextService.prototype.Send = function (controllerName, actionName, data, callback, wrapErrors) {
        if (wrapErrors === void 0) { wrapErrors = true; }
        this.http.post(this.BuidUrl(controllerName, actionName), data).then(function (res) {
            if (wrapErrors && res.data.success === false) {
                this.ngNotify.set(res.data.message, {
                    type: 'error',
                    sticky: true,
                    button: true
                });
                return;
            }
            callback(res.data);
        }.bind(this));
    };
    ContextService.prototype.SetCurrentUser = function (user) {
        this.currentUser = user;
        this.currentUser.uuid = user.mail + user.id;
    };
    ContextService.prototype.GetCurrentUser = function () {
        return this.currentUser;
    };
    ContextService.prototype.BuidUrl = function (controllerName, actionName, args) {
        var strPath = this.GlobalConfig.baseApiUlr + controllerName + "/" + actionName;
        if (args) {
            var params = [];
            for (var paramName in args) {
                params.push(paramName + "=" + args[paramName]);
            }
            strPath += "?" + params.join("&");
        }
        return strPath;
    };
    ContextService.$inject = ['$rootScope', '$http', 'ngNotify'];
    return ContextService;
}());
angular
    .module('app')
    .service('contextService', ContextService);
