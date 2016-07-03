var ContactList = (function () {
    function ContactList() {
        this.restrict = 'EA';
    }
    ContactList.prototype.link = function (scope, element, attrs) {
    };
    return ContactList;
}());
angular
    .module('app')
    .directive('contactList', [ContactList]);
