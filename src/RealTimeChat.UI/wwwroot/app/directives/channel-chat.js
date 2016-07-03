var ChannelChat = (function () {
    function ChannelChat() {
        this.restrict = 'EA';
        this.templateUrl = 'app/views/channel-chat.html';
        this.replace = true;
        this.controller = chatController;
        this.scope = {
            channel: "@"
        };
        this.link = function () {
        };
    }
    return ChannelChat;
}());
angular
    .module('app')
    .directive('channelChat', [function () { return new ChannelChat(); }]);
