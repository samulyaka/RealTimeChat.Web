var FileViews = (function () {
    function FileViews() {
        this.restrict = 'E';
        this.templateUrl = window["GlobalConfig"].baseUrl + 'app/views/file-views.html';
        this.replace = true;
        this.controller = fileViewsController;
        this.link = function () {
        };
    }
    return FileViews;
}());
angular
    .module('app')
    .directive('fileViews', [function () { return new FileViews(); }]);
