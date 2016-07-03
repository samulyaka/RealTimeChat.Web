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
var baseController = (function () {
    function baseController($scope, $rootScope, $http, $location, ngNotify) {
        this.scope = $scope;
        this.rootScope = $rootScope;
        this.http = $http;
        this.location = $location;
        this.ngNotify = ngNotify;
        this.GlobalConfig = window['GlobalConfig'];
    }
    baseController.prototype.Send = function (controllerName, actionName, data, callback, wrapErrors) {
        if (wrapErrors === void 0) { wrapErrors = true; }
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
    };
    baseController.prototype.SetCurrentUser = function (user) {
        this.rootScope.currentUser = user;
        this.rootScope.currentUser.uuid = user.mail + user.id;
        this.rootScope.currentUser.activeChannelUUID = '';
    };
    baseController.prototype.GetCurrentUser = function () {
        return this.rootScope.currentUser;
    };
    baseController.prototype.BuidUrl = function (controllerName, actionName) {
        return this.GlobalConfig.baseApiUlr + controllerName + "/" + actionName;
    };
    return baseController;
}());
