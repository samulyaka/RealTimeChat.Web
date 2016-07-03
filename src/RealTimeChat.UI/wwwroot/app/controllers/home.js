var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var homeController = (function (_super) {
    __extends(homeController, _super);
    function homeController($scope, $rootScope, $http, $location, pubnubService) {
        _super.call(this, $scope, $rootScope, $http, $location);
        this.pubnubService = pubnubService;
    }
    return homeController;
}(baseController));
angular.module("app").controller('homeController', homeController);
