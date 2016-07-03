var FileViews = (function () {
    function FileViews() {
        this.restrict = 'EA';
        this.templateUrl = 'app/views/file-views.html';
        this.replace = true;
        this.link = function () {
        };
    }
    return FileViews;
}());
angular
    .module('app')
    .directive('fileViews', [function () { return new FileViews(); }]);
