notSoClear.directive('todoFocus', function( $timeout ) {



    return function( scope, elem, attrs ) {
        //console.log("in directive");
        scope.$watch(attrs.todoFocus, function( newval ) {
            if ( newval ) {
                $timeout(function() {
                    elem[0].focus();

                    window.scrollTo(0, 0);
                    document.body.scrollTop = 0;

                    setTimeout(function() {
                        elem[0].value = elem[0].value + " ";
                        elem[0].value  = elem[0].value.substring(0, (elem[0].value.length-1));
                    }, 500);



                }, 0, false);
            }
        });
    };
});