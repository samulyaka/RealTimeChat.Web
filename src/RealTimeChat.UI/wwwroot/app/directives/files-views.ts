class FileViews implements ng.IDirective {

    restrict: string = 'E';
    templateUrl: string = 'app/views/file-views.html';
    replace: boolean = true;
    scope: any = {
        channel: "@",
    };
    controller: any = fileViewsController; 
    constructor() {
    }
    public link = () => {
        window['initThirdPartLibs']();
    }
}
angular
    .module('app')
    .directive('fileViews', [function () { return new FileViews(); }]);