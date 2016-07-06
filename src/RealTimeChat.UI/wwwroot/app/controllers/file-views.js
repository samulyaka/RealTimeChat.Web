var fileViewsController = (function () {
    function fileViewsController($scope, $rootScope, contextService, $timeout, $window) {
        var _this = this;
        this.scope = $scope;
        this.rootScope = $rootScope;
        this.contextService = contextService;
        this.scope.Context = contextService;
        this.timeout = $timeout;
        this.scope.moment = $window.moment;
        this.scope.isBlockVisible = true;
        this.filesChatSelected = "";
        this.scope.activeFileChannelUUID = null;
        if ($scope.channel) {
            this.activeChannelUUID = $scope.channel;
        }
        $scope.$watch("channel", function (newValue, oldValue, scope) {
            if (newValue) {
                this.activeChannelUUID = $scope.channel;
            }
            this.UpdateFiles();
        }.bind(this));
        this.UpdateFiles();
        $scope.$root.$on("FileUploaded", function () {
            _this.LoadFiles();
        });
    }
    fileViewsController.prototype.AddressFormatting = function (text) {
        var newText = text;
        //array of find replaces
        var findreps = [
            { find: /^([^\|]+) \| /g, rep: '<div class="message-sender">$1</div>' },
            { find: /([^\|><\(\)]+)$/g, rep: '<div class="text">$1</div>' }
        ];
        for (var i in findreps) {
            newText = newText.replace(findreps[i].find, findreps[i].rep);
        }
        return newText;
    };
    fileViewsController.prototype.SelectFile = function () {
        var _this = this;
        var newUUID = new UUIDPupNubModel();
        if (this.filesChatSelected) {
            this.scope.Files.map(function (file) {
                if (file.id == _this.filesChatSelected) {
                    newUUID.uuid = file.filesChatUID;
                    _this.scope.activeFileChannelUUID = newUUID;
                }
            });
        }
        else {
            this.scope.activeFileChannelUUID = newUUID;
        }
    };
    fileViewsController.prototype.UpdateFiles = function () {
        if (!this.activeChannelUUID) {
            this.scope.isBlockVisible = false;
            return;
        }
        this.LoadFiles();
    };
    fileViewsController.prototype.LoadFiles = function () {
        var _this = this;
        if (!this.activeChannelUUID) {
            return;
        }
        var chatUUID = JSON.parse(this.activeChannelUUID).uuid;
        this.contextService.Send("Files", "LoadFiles", { ChatUID: chatUUID }, function (res) {
            _this.filesChatSelected = "";
            var newUUID = new UUIDPupNubModel();
            if (res.data.length > 0) {
                _this.scope.isBlockVisible = true;
                _this.scope.Files = res.data;
                newUUID.uuid = res.data[res.data.length - 1].filesChatUID;
                _this.filesChatSelected = res.data[res.data.length - 1].id + "";
            }
            else {
                _this.scope.isBlockVisible = false;
                _this.scope.Files = [];
            }
            _this.scope.activeFileChannelUUID = newUUID;
            setTimeout(function () {
                if (this.scope.$root.$$phase != '$apply' && this.scope.$root.$$phase != '$digest') {
                    this.scope.$apply();
                }
            }.bind(_this), 5000);
        });
    };
    fileViewsController.$inject = ['$scope', '$rootScope', 'contextService', '$timeout', '$window'];
    return fileViewsController;
}());
angular.module("app").controller('fileViewsController', fileViewsController);
