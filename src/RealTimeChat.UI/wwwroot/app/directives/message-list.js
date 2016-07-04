var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MessageList = (function () {
    function MessageList($scope, $rootScope) {
        this.restrict = 'E';
        this.templateUrl = 'app/views/message-list.html';
        this.replace = true;
        this.scope = {
            channel: "@",
        };
        this.controller = MessageListController;
        this.$rootScope = $rootScope;
        //   this.link = this.LinkInit.bind(this);
        //    this.elements = {};
    }
    MessageList.prototype.LinkInit = function (scope, element, attrs, ctrl, $rootScope) {
        //    this.elements[this.$scope.channel] = $('.messages-list',element);//angular.element(element);
        // Watch the scroll and trigger actions
        //    this.elements[this.$scope.channel].on("scroll", _.debounce(this.watchScroll.bind(this), 250));
    };
    return MessageList;
}());
angular
    .module('app')
    .directive('messageList', [function ($scope, $rootScope) {
        return new MessageList($scope, $rootScope);
    }]);
var MessageListController = (function (_super) {
    __extends(MessageListController, _super);
    function MessageListController($scope, $element, $attrs, pubnubService, $anchorScroll, $http, $location, $rootScope, ngNotify, Upload, $timeout, $sce) {
        _super.call(this, $scope, $rootScope, $http, $location, ngNotify);
        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.ngNotify = ngNotify;
        this.Upload = Upload;
        this.timeout = $timeout;
        this.element = $('.messages-list', $element); //angular.element(element);
        // Watch the scroll and trigger actions
        this.element.on("scroll", _.debounce(this.watchScroll.bind(this), 250));
        $scope.SendMessage = this.SendMessage.bind(this);
        $scope.ChangeMessage = this.ChangeMessage.bind(this);
        $scope.UploadFiles = this.UploadFiles.bind(this);
        $scope.autoScrollDown = true;
        $scope.trust = $sce.trustAsHtml;
        this.pubnubService = pubnubService;
        this.$anchorScroll = $anchorScroll;
        if ($scope.channel) {
            console.log($scope.channel);
            this.pubnubService.InitChannel($scope.channel, this.NewMessage.bind(this));
            this.pubnubService.GetMessages($scope.channel, this.unregister.bind(this), function (msgs) {
                $scope.messages = msgs;
                if (this.$scope.$root.$$phase != '$apply' && this.$scope.$root.$$phase != '$digest') {
                    this.$scope.$apply();
                }
            }.bind(this));
        }
        $scope.$watch("channel", function (newValue, oldValue, scope) {
            console.log("change chat: " + newValue);
            $scope.messages = [];
            if (newValue) {
                this.pubnubService.InitChannel(newValue, this.NewMessage.bind(this));
                this.pubnubService.GetMessages(newValue, this.unregister.bind(this), function (msgs) {
                    $scope.messages = msgs;
                    if (this.$scope.$root.$$phase != '$apply' && this.$scope.$root.$$phase != '$digest') {
                        this.$scope.$apply();
                    }
                }.bind(this));
            }
            scope.message = "";
        }.bind(this));
    }
    MessageListController.prototype.SendMessage = function () {
        console.log("send!", this.$scope.channel, '-');
        if (this.$scope.channel) {
            this.pubnubService.SendMessage(this.$scope.channel, this.$scope.message);
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
        if (event.which === 13) {
            event.preventDefault();
            this.SendMessage();
        }
    };
    MessageListController.prototype.unregister = function () {
        _.defer(this.scrollToBottom.bind(this));
    };
    MessageListController.prototype.scrollToBottom = function () {
        console.log("aaa " + this.$scope.channel);
        this.element.scrollTop($(this.element).prop('scrollHeight'));
    };
    MessageListController.prototype.UploadFiles = function (file, errFiles) {
        var _this = this;
        if (file) {
            file.upload = this.Upload.upload({
                //url: this.BuidUrl('Files', 'FileUpload') + '?chatid=' + this.$scope.channel,
                url: window['GlobalConfig'].baseApiUlr + 'Files' + "/" + 'FileUpload' + '?chatid=' + this.$scope.channel,
                data: { file: file }
            });
            file.upload.then(function (response) {
                var fileUrl = window['GlobalConfig'].baseApiUlr + 'Files' + "/" + 'GetFile' + '/' + response.data.data.fileId;
                _this.$rootScope.$emit("FileUploaded", {});
                var fileMessage = '<span class="uploaded-text">uploaded a file</span> <a class="uploaded-link" href="' + fileUrl + '">' + file.name + '</a>';
                if (~file.type.indexOf('image')) {
                    fileMessage += '<div class="image-preview"><img src="' + fileUrl + '"></div>';
                }
                _this.pubnubService.SendMessage(_this.$scope.channel, fileMessage);
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
        this.pubnubService.GetMessages(this.$scope.channel, this.unregister.bind(this), function (msgs) { currentMessage = msgs[0].uuid; }.bind(this));
        this.pubnubService.FetchPreviousMessages(this.$scope.channel).then(function (m) {
            // Scroll to the previous message 
            this.$anchorScroll(currentMessage);
        }.bind(this));
    };
    MessageListController.prototype.watchScroll = function () {
        if (this.hasScrollReachedTop()) {
            if (this.pubnubService.MessagesAllFetched(this.$scope.channel)) {
            }
            else {
                this.fetchPreviousMessages();
            }
        }
        // Update the autoScrollDown value 
        this.$scope.autoScrollDown = this.hasScrollReachedBottom();
    };
    return MessageListController;
}(baseController));
angular.module("app").controller('messageListController', MessageListController);
