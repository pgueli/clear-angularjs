notSoClear.directive('todoFocus', function( $timeout ) {



    return function( scope, elem, attrs ) {
        console.log("in directive");
        scope.$watch(attrs.todoFocus, function( newval ) {
            if ( newval ) {
                $timeout(function() {
                    elem[0].focus();
                }, 0, false);
            }
        });
    };
});