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
        this.scope.SelectFile = this.SelectFile.bind(this);
        this.scope.filesChatSelected = "";
        if ($scope.channel) {
            this.activeChannelUUID = $scope.channel; //JSON.parse($scope.channel).uuid;
        }
        $scope.$watch("channel", function (newValue, oldValue, scope) {
            if (newValue) {
                this.activeChannelUUID = $scope.channel; //JSON.parse($scope.channel).uuid; 
            }
            this.UpdateFiles();
        }.bind(this));
        $scope.$watch('filesChatSelected', this.SelectFile.bind(this));
        this.UpdateFiles();
        $rootScope.$on("FileUploaded", function () {
            _this.LoadFiles();
        });
        $('select#files-list').selectmenu({
            style: 'popup',
            width: 410,
            height: 50,
            format: this.AddressFormatting
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
        if (this.scope.filesChatSelected) {
            this.scope.Files.map(function (file) {
                _this.scope.filesChatSelected = $('select#files-list').val();
                if (file.id == _this.scope.filesChatSelected) {
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
    fileViewsController.$inject = ['$scope', '$rootScope', 'contextService', '$timeout', '$window'];
    return fileViewsController;
}());
angular.module("app").controller('fileViewsController', fileViewsController);
