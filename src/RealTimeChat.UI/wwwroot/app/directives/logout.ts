class Logout implements ng.IDirective {

    restrict: string = 'EA';
    templateUrl: string = 'app/views/logout.html';
    replace: boolean = true;
    constructor() {
    }
    public link = () => {
    }
}
angular
    .module('app')
    .directive('logout', [function () { return new Logout(); }]);