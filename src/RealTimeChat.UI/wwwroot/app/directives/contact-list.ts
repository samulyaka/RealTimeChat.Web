class ContactList implements ng.IDirective {

    restrict: string = 'EA';
    templateUrl:string = 'app/views/contacts.html';
    replace: boolean = true;
    constructor() {
    }
    public link = () => {
    }
}
angular
    .module('app')
    .directive('contacts', [function () { return new ContactList(); }]);