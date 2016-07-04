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
        this.scope.SelectFile = this.SelectFile.bind(this);
        this.scope.filesChatSelected = "";
        $rootScope.$watch('activeChannelUUID', this.UpdateFiles.bind(this));
        $scope.$watch('filesChatSelected', this.SelectFile.bind(this));
        $rootScope.$on("FileUploaded", function () {
            _this.LoadFiles();
        });
        $('select#files-list').selectmenu({
            style: 'popup',
            width: 450,
            height: 50,
            format: this.AddressFormatting
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
    fileViewsController.prototype.SelectFile = function () {
        var _this = this;
        if (this.scope.filesChatSelected) {
            this.scope.Files.map(function (file) {
                _this.scope.filesChatSelected = $('select#files-list').val();
                if (file.id == _this.scope.filesChatSelected)
                    _this.scope.activeFileChannelUUID = file.filesChatUID;
            });
        }
        else {
            this.scope.activeFileChannelUUID = "";
        }
    };
    fileViewsController.prototype.UpdateFiles = function () {
        if (!this.rootScope.activeChannelUUID) {
            this.scope.isBlockVisible = false;
            return;
        }
        this.activeChannelUUID = this.rootScope.activeChannelUUID;
        this.LoadFiles();
    };
    fileViewsController.prototype.LoadFiles = function () {
        var _this = this;
        this.Send("Files", "LoadFiles", { ChatUID: this.activeChannelUUID }, function (res) {
            _this.scope.filesChatSelected = "";
            _this.scope.activeFileChannelUUID = "";
            if (res.data.length) {
                _this.scope.isBlockVisible = true;
                _this.scope.Files = res.data;
                _this.timeout(function () {
                    $('select#files-list').selectmenu();
                }, 1000);
            }
            else {
                _this.scope.isBlockVisible = false;
                _this.scope.Files = [];
            }
        });
    };
    return fileViewsController;
}(baseController));
angular.module("app").controller('fileViewsController', fileViewsController);
