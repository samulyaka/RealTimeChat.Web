var ContactList = (function () {
    // controller: any = contactsController; 
    function ContactList() {
        this.restrict = 'E';
        this.templateUrl = 'app/views/contacts.html';
        //   replace: boolean = true;
        this.scope = {};
        this.link = function () {
        };
    }
    return ContactList;
}());
angular
    .module('app')
    .directive('contacts', [function () { return new ContactList(); }]);
