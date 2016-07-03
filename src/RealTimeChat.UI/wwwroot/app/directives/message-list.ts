class MessageList implements ng.IDirective {

    restrict: string = 'E';
    templateUrl: string = 'app/views/contacts.html';
    replace: boolean = true;
    $rootScope: any;
    $anchorScroll: ng.IAnchorScrollProvider; 
    pubnubService: pubnubService;
    ngNotify: any;
    scope: Object = {
        channel: "@"
    };
    constructor($rootScope: any, $anchorScroll: ng.IAnchorScrollProvider, pubnubService: pubnubService, ngNotify: any) {
        this.$rootScope = $rootScope;
        this.$anchorScroll = $anchorScroll;
        this.pubnubService = pubnubService;
        this.ngNotify = ngNotify;
    }
    public controller = ($scope) => {
        $scope.autoScrollDown = true;
        $scope.messages = this.pubnubService.GetMessages($scope.channel);
    };
    public link = (scope: any, element: any, attrs: any, ctrl: any, $rootScope: any, $anchorScroll: any, pubnubService: pubnubService, ngNotify: any) => {

        element = angular.element(element);

        var scrollToBottom = function () {
            element.scrollTop(element.prop('scrollHeight'));
        };

        var hasScrollReachedBottom = function () {
            return element.scrollTop() + element.innerHeight() >= element.prop('scrollHeight')
        };

        var hasScrollReachedTop = function () {
            return element.scrollTop() === 0;
        };

        var fetchPreviousMessages = function () {

            ngNotify.set('Loading previous messages...', 'success');

            var currentMessage = pubnubService.GetMessages(scope.channel)[0].uuid

            pubnubService.FetchPreviousMessages(scope.channel).then(function (m) {

                // Scroll to the previous message 
                $anchorScroll(currentMessage);

            });

        };

        var watchScroll = function () {

            if (hasScrollReachedTop()) {

                if (pubnubService.MessagesAllFetched(scope.channel)) {
                    ngNotify.set('All the messages have been loaded', 'grimace');
                }
                else {
                    fetchPreviousMessages();
                }
            }

            // Update the autoScrollDown value 
            scope.autoScrollDown = hasScrollReachedBottom()

        };

        var init = function () {

            // Scroll down when the list is populated
            var unregister = $rootScope.$on('factory:message:populated', function () {
                // Defer the call of scrollToBottom is useful to ensure the DOM elements have been loaded
              //  _.defer(scrollToBottom);
                unregister();

            });

            // Scroll down when new message
            pubnubService.SubcribeNewMessage(scope.channel, function () {
                if (scope.autoScrollDown) {
                    scrollToBottom()
                }
            });

            // Watch the scroll and trigger actions
          //  element.bind("scroll", _.debounce(watchScroll, 250));
        };

        init();
    }
}
angular
    .module('app')
    .directive('messageList', [function ($rootScope: any, $anchorScroll: ng.IAnchorScrollProvider, pubnubService: pubnubService, ngNotify: any) {
        return new MessageList($rootScope, $anchorScroll, pubnubService, ngNotify);
    }]);
    