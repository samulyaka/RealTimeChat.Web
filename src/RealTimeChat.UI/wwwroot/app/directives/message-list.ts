class MessageList implements ng.IDirective {

    restrict: string = 'E';
    templateUrl: string = 'app/views/message-list.html';
    replace: boolean = true;
    Upload: any;
    timeout: any;
    $rootScope: any;
    $anchorScroll: ng.IAnchorScrollProvider; 
    pubnubService: pubnubService;
    ngNotify: any;
    link: any;
    scope: any = {
        channel: "@",
    };
    $scope: any;
    public controller: any = MessageListController;
    
    constructor($scope, $rootScope: any) {
        this.$rootScope = $rootScope;
     //   this.link = this.LinkInit.bind(this);
    //    this.elements = {};
    }
    


    public LinkInit(scope: any, element: any, attrs: any, ctrl: any,$rootScope: any)  {
    //    this.elements[this.$scope.channel] = $('.messages-list',element);//angular.element(element);
        // Watch the scroll and trigger actions
    //    this.elements[this.$scope.channel].on("scroll", _.debounce(this.watchScroll.bind(this), 250));
    }
}
angular
    .module('app')
    .directive('messageList', [function ($scope, $rootScope: any) {
        return new MessageList($scope, $rootScope);
    }]);

class MessageListController extends baseController {
    private pubnubService: pubnubService;
    public Contacts: any;
    private Upload: any;
    private timeout: any;
    $scope: any;
    $rootScope: any;
    $anchorScroll: ng.IAnchorScrollProvider;
    element: any;
   
    constructor($scope, $element, $attrs, pubnubService: pubnubService, $anchorScroll: ng.IAnchorScrollProvider, $http: ng.IHttpService, $location: ng.ILocationService, $rootScope: any, ngNotify: any, Upload: any, $timeout: ng.ITimeoutService, $sce: any) {
        super($scope, $rootScope, $http, $location, ngNotify);
        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.ngNotify = ngNotify;
        this.Upload = Upload;
        this.timeout = $timeout;

        this.element = $('.messages-list', $element);//angular.element(element);
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
            this.pubnubService.InitChannel($scope.channel, this.NewMessage.bind(this));
            this.pubnubService.GetMessages($scope.channel, this.unregister.bind(this), function (msgs) {
                $scope.messages = msgs;
                if (this.$scope.$root.$$phase != '$apply' && this.$scope.$root.$$phase != '$digest') {
                    this.$scope.$apply();
                }
            }.bind(this));
        }
        $scope.$watch("channel", function (newValue, oldValue, scope) {
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
    SendMessage(): void {
        if (this.$scope.channel) {
            this.pubnubService.SendMessage(this.$scope.channel, { text: this.$scope.message });
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
        this.element.scrollTop($(this.element).prop('scrollHeight'));
    }

    UploadFiles(file, errFiles): void {
        if (file) {

            file.upload = this.Upload.upload({
                //url: this.BuidUrl('Files', 'FileUpload') + '?chatid=' + this.$scope.channel,
                url: window['GlobalConfig'].baseApiUlr + 'Files' + "/" + 'FileUpload' + '?chatid=' + this.$scope.channel,
                data: { file: file }
            });

            file.upload.then((response) => {
                var fileUrl = window['GlobalConfig'].baseApiUlr + 'Files' + "/" + 'GetFile' + '/' + response.data.data.fileId;
                this.$rootScope.$emit("FileUploaded", {});

                if (~file.type.indexOf('image')) {
                    this.pubnubService.SendMessage(this.$scope.channel, { image: { fileUrl, fileName: file.name } });
                } else {
                    this.pubnubService.SendMessage(this.$scope.channel, { file: { fileUrl, fileName: file.name } });
                }

            }, (response) => {
                if (response.status > 0)
                    this.$scope.errorMsg = response.status + ': ' + response.data;
            });
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
        this.pubnubService.GetMessages(this.$scope.channel, this.unregister.bind(this), function (msgs) { currentMessage = msgs[0] ? msgs[0].uuid : null; }.bind(this));

        this.pubnubService.FetchPreviousMessages(this.$scope.channel).then(function (m) {

            // Scroll to the previous message 
            this.$anchorScroll(currentMessage);

        }.bind(this));

    }
    public watchScroll() {
        if (this.hasScrollReachedTop()) {

            if (this.pubnubService.MessagesAllFetched(this.$scope.channel)) {
                //  this.ngNotify.set('All the messages have been loaded', 'grimace');
            }
            else {
                this.fetchPreviousMessages();
            }
        }
        this.$scope.autoScrollDown = this.hasScrollReachedBottom();
    }
}
angular.module("app").controller('messageListController', MessageListController);