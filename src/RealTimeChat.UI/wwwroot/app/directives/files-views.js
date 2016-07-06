var FileViews = (function () {
    function FileViews() {
        this.restrict = 'E';
        this.templateUrl = 'app/views/file-views.html';
        this.replace = true;
        this.scope = {
            channel: "@"
        };
        this.controller = fileViewsController;
        this.link = function () {
        };
    }
    return FileViews;
}());
angular
    .module('app')
    .directive('fileViews', [function () { return new FileViews(); }]);
