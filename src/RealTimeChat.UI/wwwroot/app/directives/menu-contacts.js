(function() {
    'use strict';

    angular
        .module('app')
        .directive('menu_contacts', menu_contacts);

    menu_contacts.$inject = ['$window'];
    
    function menu_contacts ($window) {
        // Usage:
        //     <menu_contacts></menu_contacts>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'EA'
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();