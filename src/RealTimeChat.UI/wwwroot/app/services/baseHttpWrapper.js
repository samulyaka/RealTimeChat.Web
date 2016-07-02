(function () {
    'use strict';

    angular
        .module('app')
        .factory('baseHttpWrapper', baseHttpWrapper);

    baseHttpWrapper.$inject = ['$http'];

    function baseHttpWrapper($http) {
        var service = {
            getData: getData
        };

        return service;

        function getData() { }
    }
})();