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
    element: any;
    link: any;
    $scope: any = {
        channel: "@",
    };

    
    constructor($scope, $rootScope: any) {
        this.$rootScope = $rootScope;
        console.log(this.pubnubService);
        this.link = this.LinkInit.bind(this);
    }
    public controller = ($scope, pubnubService: pubnubService, $anchorScroll: ng.IAnchorScrollProvider, $rootScope: any, ngNotify: any, Upload: any, $timeout: ng.ITimeoutService, $sce: any) => {
        console.log($scope.channel);
        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.ngNotify = ngNotify;
        this.Upload = Upload;
        this.timeout = $timeout;
        $scope.SendMessage = this.SendMessage.bind(this);
        $scope.ChangeMessage = this.ChangeMessage.bind(this);
        $scope.UploadFiles = this.UploadFiles.bind(this);
        $scope.autoScrollDown = true;
        $scope.trust = $sce.trustAsHtml;
        this.pubnubService = pubnubService;
        this.$anchorScroll = $anchorScroll;
        console.log(this.pubnubService);
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
            console.log(newValue);
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
    };
    SendMessage(): void {
        console.log("send!", this.$scope.channel, '-');
        if (this.$scope.channel) {
            this.pubnubService.SendMessage(this.$scope.channel, this.$scope.message);
        }
        this.$scope.message = "";
        this.$scope.messageInputFocus = true;
    }

    ChangeMessage(event): void {
        if (event.which === 13) {// press enter key
            event.preventDefault();
            this.SendMessage();
        }
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
                this.$scope.message = '<span class="uploaded-text">uploaded a file</span> <a class="uploaded-link" href="' + fileUrl + '">' + file.name + '</a>';
                if (~file.type.indexOf('image')) {
                    this.$scope.message += '<div class="image-preview"><img src="' + fileUrl + '"></div>';
                }
                this.SendMessage()
            }, (response) => {
                if (response.status > 0)
                    this.$scope.errorMsg = response.status + ': ' + response.data;
            });
        }
    }

    public NewMessage(msgs) {
        console.log("new!!!");
        this.$scope.messages = msgs;
        this.$scope.$apply();
        if (this.$scope.autoScrollDown) {
            this.scrollToBottom();
        }
    }
        // Scroll down when the list is populated
    public unregister() {
    //    this.$scope.messages = this.pubnubService.GetMessages(this.$scope.channel, this.unregister.bind(this));
        // Defer the call of scrollToBottom is useful to ensure the DOM elements have been loaded
        _.defer(this.scrollToBottom.bind(this));
      //  this.unregister();
    }
    public scrollToBottom () {
      //  this.element.scrollTop($(this.element).prop('scrollHeight'));
        $(this.element).scrollTop($(this.element)[0].scrollHeight);
    }
    public hasScrollReachedBottom () {
        return $(this.element).scrollTop() + $(this.element).innerHeight() >= $(this.element).prop('scrollHeight');
    }
    public hasScrollReachedTop () {
        return $(this.element).scrollTop() === 0;
    }
    public fetchPreviousMessages () {

        this.ngNotify.set('Loading previous messages...', 'success');

        var currentMessage = null;
        this.pubnubService.GetMessages(this.$scope.channel, this.unregister.bind(this), function (msgs) { currentMessage = msgs[0].uuid; }.bind(this));

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
        // Update the autoScrollDown value 
        this.$scope.autoScrollDown = this.hasScrollReachedBottom();
    }

    public LinkInit(scope: any, element: any, attrs: any, ctrl: any,$rootScope: any)  {
        this.element = $('.messages-list',element);//angular.element(element);
        // Watch the scroll and trigger actions
        this.element.on("scroll", _.debounce(this.watchScroll.bind(this), 250));
    }
}
angular
    .module('app')
    .directive('messageList', [function ($scope, $rootScope: any) {
        return new MessageList($scope, $rootScope);
    }]);