(function () {
    'use strict';

    angular
        .module('app')
        .controller('loginController', loginController);

    loginController.$inject = ['$scope', '$http', '$location'];

    function loginController($scope, $http, $location) {
        $scope.title = 'loginController';
        $scope.UserName = 'samulyak.a@gmail.com';
        $scope.Password = '123';
        $scope.loginFailed = false;

        this.UserLogin = function () {
            $http.post(GlobalConfig.baseApiUlr + "Account/login", { Email: $scope.UserName, Password: $scope.Password }).then(function (res) {
                console.log('aaa!');
                if (res.data.success) {
                    res.data.data.Loginned = true;
                    $scope.$parent.$parent.currentUser = res.data.data;
                    $location.path("/home");
                    return false;
                }
                $scope.loginFailed = true;
                return false;
            });
        }
    }
})();
