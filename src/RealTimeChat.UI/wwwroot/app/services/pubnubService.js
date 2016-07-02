(function () {
    'use strict';

    angular
        .module('app')
        .factory('pubnubService', pubnubService);

    pubnubService.$inject = ['$http', 'Pubnub'];

    function pubnubService($http, Pubnub) {
        var service = {
            getData: getData
        };

        return service;

        function getData() { }
    }
})();