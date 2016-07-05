class ContactList implements ng.IDirective {

    restrict: string = 'E';
    templateUrl: string = 'app/views/contacts.html';
 //   replace: boolean = true;
    scope: any = {};
   // controller: any = contactsController; 
    constructor() {
    }
    public link = () => {
    }
}
angular
    .module('app')
    .directive('contacts', [function () { return new ContactList(); }]);