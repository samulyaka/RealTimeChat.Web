class UserImage implements ng.IDirective {

    restrict: string = 'E';
    template: string = '<img src="{{imageUrl}}" class="img-thumbnail">';
    replace: boolean = true;
    scope: Object = {
        imageUrl: "@",
    };
    constructor() {
    }
    public controller = function ($scope) {
        var GlobalConfig: GlobalConfigModel = window['GlobalConfig'];
        $scope.imageUrl = $scope.imageUrl || GlobalConfig.NoAvatarUrl;
    }
    public link = () => {
    }
}
angular
    .module('app')
    .directive('userImage', [function () { return new UserImage(); }]);