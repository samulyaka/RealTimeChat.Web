class FileViews implements ng.IDirective {

    restrict: string = 'E';
    templateUrl: string = 'app/views/file-views.html';
    scope: any = {
        channel: "@",
    };
    controller: any = fileViewsController;
    public controllerAs: any = "fvm";
    constructor() {
    }
    public link = () => {
        window['initThirdPartLibs']();
    }
}
angular
    .module('app')
    .directive('fileViews', [function () { return new FileViews(); }]);