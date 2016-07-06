class MessageList implements ng.IDirective {

    restrict: string = 'E';
    templateUrl: string = 'app/views/message-list.html';
    link: any = function ($scope, $element, $attrs) {
        window['initThirdPartLibs']();
    };
    scope: any = {
        channel: "@"
    };
    public controller: any = MessageListController;
    public controllerAs: any = "vm";
}
angular
    .module('app')
    .directive('messageList', [function () {
        return new MessageList();
    }]);

class MessageListController {
    private pubnubService: pubnubService;
    private contextService: ContextService;
    public Contacts: any;
    private Upload: any;
    private timeout: any;
    $scope: any;
    ngNotify: any;
    $anchorScroll: ng.IAnchorScrollProvider;
    element: any;
    private ChannelUUID: string;

    static $inject = ['$scope', '$element', '$attrs', 'contextService', 'pubnubService', '$anchorScroll', 'ngNotify', 'Upload', '$timeout', '$sce'];
    constructor($scope, $element, $attrs, contextService: ContextService, pubnubService: pubnubService, $anchorScroll: ng.IAnchorScrollProvider, ngNotify: any, Upload: any, $timeout: ng.ITimeoutService, $sce: any) {
        this.$scope = $scope;
        this.ngNotify = ngNotify;
        this.contextService = contextService;
        this.Upload = Upload;
        this.timeout = $timeout;
        this.element = $('.messages-list', $element);
        this.element.on("scroll", _.debounce(this.watchScroll.bind(this), 250));
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
            if (newValue) {
                this.ChannelUUID = JSON.parse(newValue).uuid;
                this.pubnubService.InitChannel(this.ChannelUUID, this.NewMessage.bind(this));
                this.pubnubService.GetMessages(this.ChannelUUID, this.unregister.bind(this), function (msgs) {
                    $scope.messages = msgs;
                    if (this.$scope.$root.$$phase != '$apply' && this.$scope.$root.$$phase != '$digest') {
                        this.$scope.$apply();
                    }
                }.bind(this));
            }
            scope.message = "";
        }.bind(this));
    }
    SendMessage(): void {
        if (this.$scope.channel) {
            this.pubnubService.SendMessage(this.ChannelUUID, { text: this.$scope.message });
            this.contextService.Send("Discussion", "SendMessage", { PubnubUUID: this.$scope.channel, Message: this.$scope.message }, function () { });
        }
        this.$scope.message = "";
        this.$scope.messageInputFocus = true;
    }
    public NewMessage(msgs) {
        this.$scope.messages = msgs;
        this.$scope.$apply();
        if (this.$scope.autoScrollDown) {
            this.scrollToBottom();
        }
    }

    ChangeMessage(event): void {
        if (event.which === 13) {// press enter key
            event.preventDefault();
            this.SendMessage();
        }
    }
    public unregister() {
        _.defer(this.scrollToBottom.bind(this));
    }
    public scrollToBottom() {
        $(this.element).scrollTop($(this.element).prop('scrollHeight'));
    }

    UploadFiles(file, errFiles): void {
        if (file) {

            file.upload = this.Upload.upload({
                url: window['GlobalConfig'].baseApiUlr + 'Files' + "/" + 'FileUpload' + '?chatid=' + this.ChannelUUID,
                data: { file: file }
            });

            file.upload.then(function (response) {
                var fileUrl = window['GlobalConfig'].baseApiUlr + 'Files' + "/" + 'GetFile' + '/' + response.data.data.fileId;
                this.$scope.$root.$emit("FileUploaded", {});

                this.contextService.Send("Discussion", "SendMessage", { PubnubUUID: this.$scope.channel, Message: "", IdDocument: response.data.data.fileId }, function () { });
                if (response.data.data.isImage) {
                    this.pubnubService.SendMessage(this.ChannelUUID, { image: { fileUrl, fileName: file.name } });
                } else {
                    this.pubnubService.SendMessage(this.ChannelUUID, { file: { fileUrl, fileName: file.name } });
                }

            }.bind(this), function (response) {
                if (response.status > 0)
                    this.$scope.errorMsg = response.status + ': ' + response.data;
            }.bind(this));
        }
    }
    public hasScrollReachedBottom() {
        return $(this.element).scrollTop() + $(this.element).innerHeight() >= $(this.element).prop('scrollHeight');
    }
    public hasScrollReachedTop() {
        return $(this.element).scrollTop() === 0;
    }
    public fetchPreviousMessages() {

        this.ngNotify.set('Loading previous messages...', 'success');

        var currentMessage = null;
        this.pubnubService.GetMessages(this.ChannelUUID, this.unregister.bind(this), function (msgs) { currentMessage = msgs[0] ? "msg"+msgs[0].uuid : null; }.bind(this));

        this.pubnubService.FetchPreviousMessages(this.ChannelUUID).then(function (m) {
        
            this.$anchorScroll(currentMessage);

        }.bind(this));

    }
    public watchScroll() {
        if (this.hasScrollReachedTop()) {

            if (!this.pubnubService.MessagesAllFetched(this.ChannelUUID)) {
                this.fetchPreviousMessages();
            }
        }
        this.$scope.autoScrollDown = this.hasScrollReachedBottom();
    }
}
angular.module("app").controller('messageListController', MessageListController);