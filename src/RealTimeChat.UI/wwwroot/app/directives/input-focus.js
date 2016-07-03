var InputFocus = (function () {
    function InputFocus() {
        this.link = function (scope, element, attrs, $timeout, $parse) {
            var model = $parse(attrs.focusMe);
            scope.$watch(model, function (value) {
                console.log('value=', value);
                if (value === true) {
                    $timeout(function () {
                        element[0].focus();
                    });
                }
            });
            element.bind('blur', function () {
                console.log('blur');
                scope.$apply(model.assign(scope, false));
            });
        };
    }
    return InputFocus;
}());
angular
    .module('app')
    .directive('input-focus', [function () { return new InputFocus(); }]);
