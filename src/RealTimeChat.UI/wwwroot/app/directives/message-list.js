var MessageList = (function () {
    function MessageList($scope, $rootScope, $anchorScroll, pubnubService, ngNotify) {
        var _this = this;
        this.restrict = 'E';
        this.templateUrl = 'app/views/message-list.html';
        this.replace = true;
        this.scope = {
            channel: "@"
        };
        this.controller = function ($scope, pubnubService, $rootScope) {
            console.log($scope.channel);
            _this.$scope = $scope;
            $scope.SendMessage = _this.SendMessage.bind(_this);
            $scope.ChangeMessage = _this.ChangeMessage.bind(_this);
            $scope.autoScrollDown = true;
            _this.pubnubService = pubnubService;
            console.log(_this.pubnubService);
            if ($scope.channel) {
                _this.pubnubService.InitChannel($scope.channel, _this.NewMessage.bind(_this));
                $scope.messages = _this.pubnubService.GetMessages($scope.channel, _this.unregister.bind(_this));
            }
            $scope.$watch("channel", function (newValue, oldValue, scope) {
                console.log(newValue);
                if (newValue) {
                    this.pubnubService.InitChannel(newValue, this.NewMessage.bind(this));
                    scope.messages = this.pubnubService.GetMessages(newValue, this.unregister.bind(this));
                }
                scope.message = "";
            }.bind(_this));
        };
        this.$rootScope = $rootScope;
        this.$anchorScroll = $anchorScroll;
        this.pubnubService = pubnubService;
        console.log(this.pubnubService);
        this.ngNotify = ngNotify;
        this.link = this.LinkInit.bind(this);
    }
    MessageList.prototype.SendMessage = function () {
        console.log("send!");
        if (this.$scope.channel) {
            this.pubnubService.SendMessage(this.$scope.channel, this.$scope.message);
        }
        this.$scope.message = "";
        this.$scope.messageInputFocus = true;
    };
    MessageList.prototype.ChangeMessage = function (event) {
        if (event.which === 13) {
            event.preventDefault();
            this.SendMessage();
        }
    };
    MessageList.prototype.NewMessage = function () {
        if (this.$scope.autoScrollDown) {
            this.scrollToBottom();
        }
    };
    // Scroll down when the list is populated
    MessageList.prototype.unregister = function () {
        this.$scope.messages = this.pubnubService.GetMessages(this.$scope.channel, this.unregister.bind(this));
        // Defer the call of scrollToBottom is useful to ensure the DOM elements have been loaded
        _.defer(this.scrollToBottom.bind(this));
        //  this.unregister();
    };
    MessageList.prototype.scrollToBottom = function () {
        this.element.scrollTop(this.element.prop('scrollHeight'));
    };
    MessageList.prototype.hasScrollReachedBottom = function () {
        return this.element.scrollTop() + this.element.innerHeight() >= this.element.prop('scrollHeight');
    };
    MessageList.prototype.hasScrollReachedTop = function () {
        return this.element.scrollTop() === 0;
    };
    MessageList.prototype.fetchPreviousMessages = function () {
        this.ngNotify.set('Loading previous messages...', 'success');
        var currentMessage = this.pubnubService.GetMessages(this.$scope.channel, this.unregister.bind(this))[0].uuid;
        this.pubnubService.FetchPreviousMessages(this.$scope.channel).then(function (m) {
            // Scroll to the previous message 
            this.$anchorScroll(currentMessage);
        }.bind(this));
    };
    MessageList.prototype.watchScroll = function () {
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
    };
    MessageList.prototype.LinkInit = function (scope, element, attrs, ctrl, $rootScope) {
        this.element = angular.element(element);
        // Watch the scroll and trigger actions
        this.element.bind("scroll", _.debounce(this.watchScroll, 250));
    };
    return MessageList;
}());
angular
    .module('app')
    .directive('messageList', [function ($scope, $rootScope, $anchorScroll, pubnubService, ngNotify) {
        return new MessageList($scope, $rootScope, $anchorScroll, pubnubService, ngNotify);
    }]);
