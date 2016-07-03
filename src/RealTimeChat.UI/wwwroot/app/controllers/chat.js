var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var chatController = (function (_super) {
    __extends(chatController, _super);
    function chatController($scope, $rootScope, $http, $location, pubnubService, ngNotify) {
        _super.call(this, $scope, $rootScope, $http, $location, ngNotify);
        this.pubnubService = pubnubService;
        this.scope.SendMessage = this.SendMessage.bind(this);
        this.scope.ChangeMessage = this.ChangeMessage.bind(this);
        this.scope.message = "";
        if (this.scope.channel) {
            this.pubnubService.InitChannel(this.scope.channel, this.NewMessage.bind(this));
        }
    }
    chatController.prototype.SendMessage = function () {
        if (this.scope.channel) {
            this.pubnubService.SendMessage(this.scope.channel, this.scope.message);
        }
        this.scope.message = "";
        this.scope.messageInputFocus = true;
    };
    chatController.prototype.NewMessage = function (message) {
        console.log("newMessage");
        console.log(message);
    };
    chatController.prototype.ChangeMessage = function (event) {
        if (event.which === 13) {
            event.preventDefault();
            this.SendMessage();
        }
    };
    return chatController;
}(baseController));
angular.module("app").controller('chatController', chatController);
