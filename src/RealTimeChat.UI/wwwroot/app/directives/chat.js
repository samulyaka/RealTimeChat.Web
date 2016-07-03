var Chat = (function () {
    function Chat() {
        this.restrict = 'EA';
        this.templateUrl = 'app/views/chat.html';
        this.replace = true;
        this.link = function () {
        };
    }
    return Chat;
}());
angular
    .module('app')
    .directive('chat', [function () { return new Chat(); }]);
