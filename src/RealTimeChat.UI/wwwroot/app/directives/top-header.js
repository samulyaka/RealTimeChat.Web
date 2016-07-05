var TopHeader = (function () {
    function TopHeader() {
        this.restrict = 'E';
        this.templateUrl = 'app/views/top-header.html';
        this.replace = true;
        this.link = function () {
        };
    }
    return TopHeader;
}());
angular
    .module('app')
    .directive('topHeader', [function () { return new TopHeader(); }]);
