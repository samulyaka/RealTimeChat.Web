class ChannelChat implements ng.IDirective {

    restrict: string = 'EA';
    templateUrl: string = 'app/views/channel-chat.html';
    replace: boolean = true;
    controller: any = chatController; 
    scope: Object = {
        channel: "@"
    };
    constructor() {
    }
    public link = () => {
    }
}
angular
    .module('app')
    .directive('channelChat', [function () { return new ChannelChat(); }]);