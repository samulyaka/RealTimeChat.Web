var FileViews = (function () {
    function FileViews() {
        this.restrict = 'E';
        this.templateUrl = 'app/views/file-views.html';
        this.scope = {
            channel: "@"
        };
        this.controller = fileViewsController;
        this.controllerAs = "fvm";
        this.link = function () {
            window['initThirdPartLibs']();
        };
    }
    return FileViews;
}());
angular
    .module('app')
    .directive('fileViews', [function () { return new FileViews(); }]);
