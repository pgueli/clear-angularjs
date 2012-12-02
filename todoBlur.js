notSoClear.directive('todoBlur', function() {
    return function( scope, elem, attrs ) {
        console.log("in dir blur");
        elem.bind('blur', function() {
            scope.$apply(attrs.todoBlur);
        });
    };
});
