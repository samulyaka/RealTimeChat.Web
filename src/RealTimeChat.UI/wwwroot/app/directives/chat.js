var Chat = (function () {
    function Chat() {
        this.restrict = 'EA';
    }
    Chat.prototype.link = function (scope, element, attrs) {
    };
    return Chat;
}());
angular
    .module('app')
    .directive('chat', [Chat]);
