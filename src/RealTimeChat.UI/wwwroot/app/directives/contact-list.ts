class ContactList implements ng.IDirective {

    restrict: string = 'EA';
    controller: ''

    public link(scope, element, attrs) {
    }
}
angular
    .module('app')
    .directive('contactList', [ContactList]);