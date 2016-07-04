class MessageList implements ng.IDirective {

    restrict: string = 'E';
    templateUrl: string = 'app/views/message-list.html';
    replace: boolean = true;
    $rootScope: any;
    $anchorScroll: ng.IAnchorScrollProvider; 
    pubnubService: pubnubService;
    ngNotify: any;
    element: any;
    link: any;
    $scope: any;
    scope: any = {
        channel: "@"
    };
    constructor($scope, $rootScope: any) {
        this.$rootScope = $rootScope;
        console.log(this.pubnubService);
        this.link = this.LinkInit.bind(this);
    }
    public controller = ($scope, pubnubService: pubnubService, $anchorScroll: ng.IAnchorScrollProvider, $rootScope: any, ngNotify: any) => {
        console.log($scope.channel);
        this.$scope = $scope;
        this.ngNotify = ngNotify;
        $scope.SendMessage = this.SendMessage.bind(this);
        $scope.ChangeMessage = this.ChangeMessage.bind(this);
        $scope.autoScrollDown = true;
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
        console.log("send!");
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