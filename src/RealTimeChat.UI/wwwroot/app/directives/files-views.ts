class FileViews implements ng.IDirective {

    restrict: string = 'EA';
    templateUrl: string = 'app/views/file-views.html';
    replace: boolean = true;
    constructor() {
    }
    public link = () => {
    }
}
angular
    .module('app')
    .directive('fileViews', [function () { return new FileViews(); }]);