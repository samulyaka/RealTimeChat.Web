class Chat implements ng.IDirective {

    restrict: string = 'EA';
    templateUrl: string = 'app/views/chat.html';
    replace: boolean = true;
    constructor() {
    }
    public link = () => {
    }
}
angular
    .module('app')
    .directive('chat', [function () { return new Chat(); }]);