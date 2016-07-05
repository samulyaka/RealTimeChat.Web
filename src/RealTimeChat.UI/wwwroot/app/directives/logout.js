var Logout = (function () {
    function Logout() {
        this.restrict = 'EA';
        this.templateUrl = 'app/views/logout.html';
        this.replace = true;
        this.link = function () {
        };
    }
    return Logout;
}());
angular
    .module('app')
    .directive('logout', [function () { return new Logout(); }]);
