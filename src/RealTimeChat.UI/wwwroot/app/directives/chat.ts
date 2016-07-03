class Chat implements ng.IDirective {

    restrict: string = 'EA';
    
    public link(scope, element, attrs) {
    }
}
angular
    .module('app')
    .directive('chat', [Chat]);