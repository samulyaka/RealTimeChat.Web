var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var fileViewsController = (function (_super) {
    __extends(fileViewsController, _super);
    function fileViewsController($scope, $rootScope, $http, $location, pubnubService, ngNotify, $timeout, $window) {
        var _this = this;
        _super.call(this, $scope, $rootScope, $http, $location, ngNotify);
        this.pubnubService = pubnubService;
        this.timeout = $timeout;
        this.scope.moment = $window.moment;
        this.scope.isBlockVisible = false;
        this.rootScope.$watch('currentUser.activeChannelUUID', this.UpdateFiles.bind(this));
        this.rootScope.$on("FileUploaded", function () {
            _this.LoadFiles();
        });
    }
    fileViewsController.prototype.AddressFormatting = function (text) {
        var newText = text;
        //array of find replaces
        var findreps = [
            { find: /^([^\|]+) \| /g, rep: '<div class="text-muted">$1</div>' },
            { find: /([^\|><\(\)]+)$/g, rep: '<div class="text-primary">$1</div>' }
        ];
        for (var i in findreps) {
            newText = newText.replace(findreps[i].find, findreps[i].rep);
        }
        return newText;
    };
    fileViewsController.prototype.UpdateFiles = function () {
        if (!this.rootScope.currentUser.activeChannelUUID) {
            this.scope.isBlockVisible = false;
            return;
        }
        this.activeChannelUUID = this.rootScope.currentUser.activeChannelUUID;
        this.LoadFiles();
    };
    fileViewsController.prototype.LoadFiles = function () {
        var _this = this;
        this.Send("Files", "LoadFiles", { ChatUID: this.activeChannelUUID }, function (res) {
            if (res.data.length) {
                _this.scope.isBlockVisible = true;
                _this.scope.Files = res.data;
                _this.timeout(function () {
                    $('select#files-list').selectmenu({
                        style: 'popup',
                        width: 450,
                        height: 50,
                        format: _this.AddressFormatting
                    });
                }, 1000);
            }
        });
    };
    return fileViewsController;
}(baseController));
angular.module("app").controller('fileViewsController', fileViewsController);
