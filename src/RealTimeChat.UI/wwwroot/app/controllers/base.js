var baseController = (function () {
    function baseController($scope, $rootScope, $http, $location) {
        this.scope = $scope;
        this.rootScope = $rootScope;
        this.http = $http;
        this.location = $location;
        this.GlobalConfig = window['GlobalConfig'];
    }
    baseController.prototype.Send = function (controllerName, actionName, data, callback, wrapErrors) {
        if (wrapErrors === void 0) { wrapErrors = true; }
        this.http.post(this.BuidUrl(controllerName, actionName), data).then(function (res) {
            if (wrapErrors && res.data.success === false) {
                return;
            }
            callback.bind(this)(res.data);
        }.bind(this));
    };
    baseController.prototype.BuidUrl = function (controllerName, actionName) {
        return this.GlobalConfig.baseApiUlr + controllerName + "/" + actionName;
    };
    return baseController;
}());
