var MessageList = (function () {
    function MessageList() {
        this.restrict = 'E';
        this.templateUrl = 'app/views/message-list.html';
        this.replace = true;
        this.link = function ($scope, $element, $attrs) {
        };
        this.scope = {
            channel: "@",
        };
        this.controller = MessageListController;
    }
    return MessageList;
}());
angular
    .module('app')
    .directive('messageList', [function () {
        return new MessageList();
    }]);
var MessageListController = (function () {
    function MessageListController($scope, $element, $attrs, contextService, pubnubService, $anchorScroll, ngNotify, Upload, $timeout, $sce) {
        this.$scope = $scope;
        this.ngNotify = ngNotify;
        this.contextService = contextService;
        this.Upload = Upload;
        this.timeout = $timeout;
        this.element = $('.messages-list', $element);
        // $(this.element).css("overfolw","auto");
        this.element.on("scroll", _.debounce(this.watchScroll.bind(this), 250));
        $scope.SendMessage = this.SendMessage.bind(this);
        $scope.ChangeMessage = this.ChangeMessage.bind(this);
        $scope.UploadFiles = this.UploadFiles.bind(this);
        $scope.autoScrollDown = true;
        $scope.trust = $sce.trustAsHtml;
        $scope.context = contextService;
        this.pubnubService = pubnubService;
        this.$anchorScroll = $anchorScroll;
        if ($scope.channel) {
            this.ChannelUUID = JSON.parse($scope.channel).uuid;
            this.pubnubService.InitChannel(this.ChannelUUID, this.NewMessage.bind(this));
            this.pubnubService.GetMessages(this.ChannelUUID, this.unregister.bind(this), function (msgs) {
                $scope.messages = msgs;
                if (this.$scope.$root.$$phase != '$apply' && this.$scope.$root.$$phase != '$digest') {
                    this.$scope.$apply();
                }
            }.bind(this));
        }
        $scope.$watch("channel", function (newValue, oldValue, scope) {
            $scope.messages = [];
            console.log("change:" + newValue);
            if (newValue) {
                this.$scope.message = "hello world!";
                this.ChannelUUID = JSON.parse(newValue).uuid;
                this.pubnubService.InitChannel(this.ChannelUUID, this.NewMessage.bind(this));
                this.pubnubService.GetMessages(this.ChannelUUID, this.unregister.bind(this), function (msgs) {
                    $scope.messages = msgs;
                    console.log(msgs);
                    if (this.$scope.$root.$$phase != '$apply' && this.$scope.$root.$$phase != '$digest') {
                        this.$scope.$apply();
                    }
                }.bind(this));
            }
            scope.message = "";
        }.bind(this));
    }
    MessageListController.prototype.SendMessage = function () {
        if (this.$scope.channel) {
            this.pubnubService.SendMessage(this.ChannelUUID, { text: this.$scope.message });
            this.contextService.Send("Discussion", "SendMessage", { PubnubUUID: this.$scope.channel, Message: this.$scope.message }, function () { });
        }
        this.$scope.message = "";
        this.$scope.messageInputFocus = true;
    };
    MessageListController.prototype.NewMessage = function (msgs) {
        this.$scope.messages = msgs;
        this.$scope.$apply();
        if (this.$scope.autoScrollDown) {
            this.scrollToBottom();
        }
    };
    MessageListController.prototype.ChangeMessage = function (event) {
        console.log("enter text!");
        if (event.which === 13) {
            event.preventDefault();
            this.SendMessage();
        }
    };
    MessageListController.prototype.unregister = function () {
        _.defer(this.scrollToBottom.bind(this));
    };
    MessageListController.prototype.scrollToBottom = function () {
        $(this.element).scrollTop($(this.element).prop('scrollHeight'));
    };
    MessageListController.prototype.UploadFiles = function (file, errFiles) {
        var _this = this;
        if (file) {
            file.upload = this.Upload.upload({
                url: window['GlobalConfig'].baseApiUlr + 'Files' + "/" + 'FileUpload' + '?chatid=' + this.$scope.channel,
                data: { file: file }
            });
            file.upload.then(function (response) {
                var fileUrl = window['GlobalConfig'].baseApiUlr + 'Files' + "/" + 'GetFile' + '/' + response.data.data.fileId;
                //this.$rootScope.$emit("FileUploaded", {});
                _this.contextService.Send("Discussion", "SendMessage", { PubnubUUID: _this.$scope.channel, Message: "", IdDocument: response.data.data.fileId }, function () { });
                if (file.IsImage) {
                    _this.pubnubService.SendMessage(_this.ChannelUUID, { image: { fileUrl: fileUrl, fileName: file.name } });
                }
                else {
                    _this.pubnubService.SendMessage(_this.ChannelUUID, { file: { fileUrl: fileUrl, fileName: file.name } });
                }
            }, function (response) {
                if (response.status > 0)
                    _this.$scope.errorMsg = response.status + ': ' + response.data;
            });
        }
    };
    MessageListController.prototype.hasScrollReachedBottom = function () {
        return $(this.element).scrollTop() + $(this.element).innerHeight() >= $(this.element).prop('scrollHeight');
    };
    MessageListController.prototype.hasScrollReachedTop = function () {
        return $(this.element).scrollTop() === 0;
    };
    MessageListController.prototype.fetchPreviousMessages = function () {
        this.ngNotify.set('Loading previous messages...', 'success');
        var currentMessage = null;
        this.pubnubService.GetMessages(this.ChannelUUID, this.unregister.bind(this), function (msgs) { currentMessage = msgs[0] ? "msg" + msgs[0].uuid : null; }.bind(this));
        this.pubnubService.FetchPreviousMessages(this.ChannelUUID).then(function (m) {
            this.$anchorScroll(currentMessage);
        }.bind(this));
    };
    MessageListController.prototype.watchScroll = function () {
        if (this.hasScrollReachedTop()) {
            if (!this.pubnubService.MessagesAllFetched(this.ChannelUUID)) {
                this.fetchPreviousMessages();
            }
        }
        this.$scope.autoScrollDown = this.hasScrollReachedBottom();
    };
    MessageListController.$inject = ['$scope', '$element', '$attrs', 'contextService', 'pubnubService', '$anchorScroll', 'ngNotify', 'Upload', '$timeout', '$sce'];
    return MessageListController;
}());
angular.module("app").controller('messageListController', MessageListController);
