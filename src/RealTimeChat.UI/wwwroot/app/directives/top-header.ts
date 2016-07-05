class TopHeader implements ng.IDirective {

    restrict: string = 'E';
    templateUrl: string = 'app/views/top-header.html';
    replace: boolean = true;
    constructor() {
    }
    public link = () => {
    }
}
angular
    .module('app')
    .directive('topHeader', [function () { return new TopHeader(); }]);