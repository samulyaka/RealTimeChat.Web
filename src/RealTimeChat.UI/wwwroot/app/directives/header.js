var Header = (function () {
    function Header() {
        this.restrict = 'E';
        this.templateUrl = 'app/views/file-views.html';
        this.replace = true;
        this.controller = fileViewsController;
        this.link = function () {
        };
    }
    return Header;
}());
angular
    .module('app')
    .directive('fileViews', [function () { return new FileViews(); }]);
