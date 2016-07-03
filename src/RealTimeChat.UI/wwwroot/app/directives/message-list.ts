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
    constructor($scope, $rootScope: any, $anchorScroll: ng.IAnchorScrollProvider, pubnubService: pubnubService, ngNotify: any) {
        this.$rootScope = $rootScope;
        this.$anchorScroll = $anchorScroll;
        this.pubnubService = pubnubService;
        console.log(this.pubnubService);
        this.ngNotify = ngNotify;
        this.link = this.LinkInit.bind(this);
    }
    public controller = ($scope, pubnubService: pubnubService, $rootScope: any) => {
        console.log($scope.channel);
        this.$scope = $scope;
        $scope.SendMessage = this.SendMessage.bind(this);
        $scope.ChangeMessage = this.ChangeMessage.bind(this);
        $scope.autoScrollDown = true;
        this.pubnubService = pubnubService;
        console.log(this.pubnubService);
        if ($scope.channel) {
            this.pubnubService.InitChannel($scope.channel, this.NewMessage.bind(this));
            $scope.messages = this.pubnubService.GetMessages($scope.channel, this.unregister.bind(this));
        }
        $scope.$watch("channel", function (newValue, oldValue, scope) {
            console.log(newValue);
            if (newValue) {
                this.pubnubService.InitChannel(newValue, this.NewMessage.bind(this));
                scope.messages = this.pubnubService.GetMessages(newValue, this.unregister.bind(this));
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
    public NewMessage() {
        if (this.$scope.autoScrollDown) {
            this.scrollToBottom();
        }
    }
        // Scroll down when the list is populated
    public unregister() {
        this.$scope.messages = this.pubnubService.GetMessages(this.$scope.channel, this.unregister.bind(this));
        // Defer the call of scrollToBottom is useful to ensure the DOM elements have been loaded
        _.defer(this.scrollToBottom.bind(this));
      //  this.unregister();
    }
    public scrollToBottom () {
        this.element.scrollTop(this.element.prop('scrollHeight'));
    }
    public hasScrollReachedBottom () {
        return this.element.scrollTop() + this.element.innerHeight() >= this.element.prop('scrollHeight');
    }
    public hasScrollReachedTop () {
        return this.element.scrollTop() === 0;
    }
    public fetchPreviousMessages () {

        this.ngNotify.set('Loading previous messages...', 'success');

        var currentMessage = this.pubnubService.GetMessages(this.$scope.channel, this.unregister.bind(this))[0].uuid;

        this.pubnubService.FetchPreviousMessages(this.$scope.channel).then(function (m) {

            // Scroll to the previous message 
            this.$anchorScroll(currentMessage);

        }.bind(this));

    }
    public watchScroll() {
        if (this.hasScrollReachedTop()) {

            if (this.pubnubService.MessagesAllFetched(this.$scope.channel)) {
                this.ngNotify.set('All the messages have been loaded', 'grimace');
            }
            else {
                this.fetchPreviousMessages();
            }
        }
        // Update the autoScrollDown value 
        this.$scope.autoScrollDown = this.hasScrollReachedBottom();
    }

    public LinkInit(scope: any, element: any, attrs: any, ctrl: any,$rootScope: any)  {
        this.element = angular.element(element);
        // Watch the scroll and trigger actions
        this.element.bind("scroll", _.debounce(this.watchScroll, 250));
    }
}
angular
    .module('app')
    .directive('messageList', [function ($scope, $rootScope: any, $anchorScroll: ng.IAnchorScrollProvider, pubnubService: pubnubService, ngNotify: any) {
        return new MessageList($scope, $rootScope, $anchorScroll, pubnubService, ngNotify);
    }]);