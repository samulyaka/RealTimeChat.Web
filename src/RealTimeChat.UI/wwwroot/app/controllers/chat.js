var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var chatController = (function (_super) {
    __extends(chatController, _super);
    function chatController($scope, $rootScope, $http, $location, pubnubService, ngNotify, Upload, $timeout) {
        _super.call(this, $scope, $rootScope, $http, $location, ngNotify);
        this.pubnubService = pubnubService;
        this.scope.SendMessage = this.SendMessage.bind(this);
        this.scope.ChangeMessage = this.ChangeMessage.bind(this);
        this.scope.UploadFiles = this.UploadFiles.bind(this);
        this.scope.message = "";
        this.Upload = Upload;
        this.timeout = $timeout;
        if (this.scope.channel) {
            this.pubnubService.InitChannel(this.scope.channel, this.NewMessage.bind(this));
        }
    }
    chatController.prototype.SendMessage = function () {
        if (this.scope.channel) {
            this.pubnubService.SendMessage(this.scope.channel, this.scope.message);
        }
        this.scope.message = "";
        this.scope.messageInputFocus = true;
    };
    chatController.prototype.NewMessage = function (message) {
        console.log("newMessage");
        console.log(message);
    };
    chatController.prototype.ChangeMessage = function (event) {
        if (event.which === 13) {
            event.preventDefault();
            this.SendMessage();
        }
    };
    chatController.prototype.UploadFiles = function (file, errFiles) {
        var _this = this;
        //var that = this;
        this.scope.f = file;
        this.scope.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = this.Upload.upload({
                url: this.BuidUrl('Files', 'FileUpload') + '?chatid=' + this.scope.channel,
                data: { file: file, ChatUID: this.scope.channel }
            });
            file.upload.then(function (response) {
                _this.rootScope.$emit("FileUploaded", {});
                _this.timeout(function () {
                    file.result = response.data;
                });
            }, function (response) {
                if (response.status > 0)
                    _this.scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
        }
    };
    return chatController;
}(baseController));
angular.module("app").controller('chatController', chatController);
