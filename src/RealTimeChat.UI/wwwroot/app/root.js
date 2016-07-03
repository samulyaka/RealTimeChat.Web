var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var rootController = (function (_super) {
    __extends(rootController, _super);
    function rootController($scope, $rootScope, $http, $location) {
        _super.call(this, $scope, $rootScope, $http, $location);
        $rootScope.currentUser = new LoginUserModel();
    }
    return rootController;
}(baseController));
angular.module("app").controller('rootController', rootController);
