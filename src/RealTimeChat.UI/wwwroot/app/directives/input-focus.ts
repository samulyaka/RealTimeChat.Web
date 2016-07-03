class InputFocus implements ng.IDirective {
    constructor() {
    }
    public link = (scope, element, attrs, $timeout, $parse) => {
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
    }
}
angular
    .module('app')
    .directive('input-focus', [function () { return new InputFocus(); }]);
