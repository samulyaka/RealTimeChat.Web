var FileViews = (function () {
    function FileViews() {
        this.restrict = 'EA';
    }
    FileViews.prototype.link = function (scope, element, attrs) {
    };
    return FileViews;
}());
angular
    .module('app')
    .directive('fileViews', [FileViews]);
