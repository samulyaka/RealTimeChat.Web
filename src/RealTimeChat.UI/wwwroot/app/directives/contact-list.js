var ContactList = (function () {
    function ContactList() {
        this.restrict = 'EA';
        this.templateUrl = 'app/views/contacts.html';
        this.replace = true;
        this.link = function () {
        };
    }
    return ContactList;
}());
angular
    .module('app')
    .directive('contacts', [function () { return new ContactList(); }]);
