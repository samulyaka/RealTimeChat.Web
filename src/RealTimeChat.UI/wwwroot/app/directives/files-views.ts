class FileViews implements ng.IDirective {

    restrict: string = 'E';
    templateUrl: string = window["GlobalConfig"].baseUrl + 'app/views/file-views.html';
    replace: boolean = true;
    controller: any = fileViewsController; 
    constructor() {
    }
    public link = () => {
    }
}
angular
    .module('app')
    .directive('fileViews', [function () { return new FileViews(); }]);