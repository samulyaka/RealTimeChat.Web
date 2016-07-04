var MessageList = (function () {
    function MessageList($scope, $rootScope) {
        var _this = this;
        this.restrict = 'E';
        this.templateUrl = 'app/views/message-list.html';
        this.replace = true;
        this.scope = {
            channel: "@"
        };
        this.controller = function ($scope, pubnubService, $anchorScroll, $rootScope, ngNotify) {
            _this.$scope = $scope;
            _this.ngNotify = ngNotify;
            $scope.SendMessage = _this.SendMessage.bind(_this);
            $scope.ChangeMessage = _this.ChangeMessage.bind(_this);
            $scope.autoScrollDown = true;
            _this.pubnubService = pubnubService;
            _this.$anchorScroll = $anchorScroll;
            if ($scope.channel) {
                _this.pubnubService.InitChannel($scope.channel, _this.NewMessage.bind(_this));
                _this.pubnubService.GetMessages($scope.channel, _this.unregister.bind(_this), function (msgs) {
                    $scope.messages = msgs;
                    if (this.$scope.$root.$$phase != '$apply' && this.$scope.$root.$$phase != '$digest') {
                        this.$scope.$apply();
                    }
                }.bind(_this));
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
            }.bind(_this));
        };
        this.$rootScope = $rootScope;
        console.log(this.pubnubService);
        this.link = this.LinkInit.bind(this);
    }
    MessageList.prototype.SendMessage = function () {
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
    MessageList.prototype.NewMessage = function (msgs) {
        this.$scope.messages = msgs;
        this.$scope.$apply();
        if (this.$scope.autoScrollDown) {
            this.scrollToBottom();
        }
    };
    MessageList.prototype.unregister = function () {
        _.defer(this.scrollToBottom.bind(this));
    };
    MessageList.prototype.scrollToBottom = function () {
        $(this.element).scrollTop($(this.element)[0].scrollHeight);
    };
    MessageList.prototype.hasScrollReachedBottom = function () {
        return $(this.element).scrollTop() + $(this.element).innerHeight() >= $(this.element).prop('scrollHeight');
    };
    MessageList.prototype.hasScrollReachedTop = function () {
        return $(this.element).scrollTop() === 0;
    };
    MessageList.prototype.fetchPreviousMessages = function () {
        this.ngNotify.set('Loading previous messages...', 'success');
        var currentMessage = null;
        this.pubnubService.GetMessages(this.$scope.channel, this.unregister.bind(this), function (msgs) { currentMessage = msgs[0].uuid; }.bind(this));
        this.pubnubService.FetchPreviousMessages(this.$scope.channel).then(function (m) {
            // Scroll to the previous message 
            this.$anchorScroll(currentMessage);
        }.bind(this));
    };
    MessageList.prototype.watchScroll = function () {
        if (this.hasScrollReachedTop()) {
            if (this.pubnubService.MessagesAllFetched(this.$scope.channel)) {
            }
            else {
                this.fetchPreviousMessages();
            }
        }
        this.$scope.autoScrollDown = this.hasScrollReachedBottom();
    };
    MessageList.prototype.LinkInit = function (scope, element, attrs, ctrl, $rootScope) {
        this.element = $('.messages-list', element);
        this.element.on("scroll", _.debounce(this.watchScroll.bind(this), 250));
    };
    return MessageList;
}());
angular
    .module('app')
    .directive('messageList', [function ($scope, $rootScope) {
        return new MessageList($scope, $rootScope);
    }]);
