var UserImage = (function () {
    function UserImage() {
        this.restrict = 'E';
        this.template = '<img src="{{imageUrl}}"/>';
        this.replace = true;
        this.scope = {
            imageUrl: "@"
        };
        this.controller = function ($scope) {
            var GlobalConfig = window['GlobalConfig'];
            $scope.imageUrl = $scope.imageUrl || GlobalConfig.NoAvatarUrl;
        };
        this.link = function () {
        };
    }
    return UserImage;
}());
angular
    .module('app')
    .directive('userImage', [function () { return new UserImage(); }]);
