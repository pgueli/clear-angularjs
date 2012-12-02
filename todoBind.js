notSoClear.directive('gfTap', function() {
   /* return function(scope, element, attrs) {
        var tapping;
        tapping = false;
        element.bind('click', function() {
            console.log("clicked");
            console.log(element.length);

            return scope.$apply(attrs['gfTap']);
            //return tapping = true;
        });
        element.bind('touchstart', function() {
            return tapping = true;
        });
        element.bind('touchmove', function() {
            return tapping = false;
        });
        return element.bind('touchend', function() {
            if (tapping) {
                return scope.$apply(attrs['gfTap']);
            }
        });
    */
   return{
       //transclude: true,
       //scope: {},
        controller: function($scope, $element){
            console.log($element);

            var gestureStarted = false;
            var bodyOffset = 0;
            var sidebarWidth = 240;
            var actionOpenWidth = 70;
            var gnStartTime = 0;
            var gbMove = false;
            var gbStillTouching = false;
            var dragDirection = "horizontal"; //horizontal || vertical
            var onHoldDelay = 2000; //ms
            var liHeight = 60;


            setupEventHandlers();

            function setupEventHandlers(){
                console.log("in  setupEventHandlers;")
                this.touchSupported =  ('ontouchstart' in window);
                this.START_EVENT = this.touchSupported ? 'touchstart' : 'mousedown';
                this.MOVE_EVENT = this.touchSupported ? 'touchmove' : 'mousemove';
                this.END_EVENT = this.touchSupported ? 'touchend' : 'mouseup';

                var self = this;
                var func = function( event ){ onTouchStart(event), true };

                $element.bind(this.START_EVENT,func );
               // mainArea.addEventListener( this.START_EVENT, func, false );
            }


            function beginDragVert(){
                console.log("in begin drag vert.")
                dragDirection = "vertical";
                $element.addClass("todoDragVert");
                var currentPositionOfLI = $('#clearUL li').index($element);
                //var index = $element.index(this);
                console.log(currentPositionOfLI)
            }


            function onTouchStart(event) {
                console.log("onTouchStart");
                console.log( event.type );
                gbStillTouching = true;

                gnStartTime = Number(new Date());
                //setTimeout(function() {SetOpacity(eID, opacity);}, timer * 30);
                setTimeout(function() {
                    checkTapHold(gnStartTime);clearTimeout();
                },onHoldDelay);


                function checkTapHold(nID) {
                    console.log('gbMove: '+gbMove+ "; gbStillTouching: " + gbStillTouching + "; "+ gnStartTime +" == " + nID);
                    if ((!gbMove) && (gbStillTouching) && (gnStartTime == nID)) {
                        gnStartTime = 0;
                        gbMove = false;
                        console.log("ID: "+$element.liID);
                        beginDragVert();
                    }
                }


                 //$(this.el).css('-webkit-transition-duration', '0');

                this.gestureStartPosition = getTouchCoordinates( event );

                var self = this;
                this.touchMoveHandler = function( event ){ onTouchMove(event) };
                this.touchUpHandler = function( event ){ onTouchEnd(event) };

                $element.bind( this.MOVE_EVENT, this.touchMoveHandler, false );
                $element.bind( this.END_EVENT, this.touchUpHandler, false );
                //$element.stop();

            }

             function onTouchMove(event) {

                gbMove = true;
                var currentPosition = getTouchCoordinates( event );
                //console.log(this.gestureStarted);


                if ( this.gestureStarted ) {
                    event.preventDefault();
                    event.stopPropagation();
                    updateBasedOnTouchPoints( currentPosition, dragDirection );
                    return;
                }
                else {
                    //console.log( Math.abs( currentPosition.x - this.gestureStartPosition.x ) );
                    //detect the gesture
                    /*if ( ( Math.abs( currentPosition.y - this.gestureStartPosition.y ) > 1 ) || ( Math.abs( currentPosition.y - this.gestureStartPosition.y ) < -1 ) ){


                        //dragging vertically - ignore this gesture
                        if (dragDirection == "vertical"){
                            console.log("really moving vert");
                        }

                        event.preventDefault();
                        event.stopPropagation();
                        updateBasedOnTouchPoints( currentPosition, "vertical" );
                        //unbindEvents();
                        return;
                    }
                    else {

                        //dragging horizontally - let's handle this
                        this.gestureStarted = true;
                        event.preventDefault();
                        event.stopPropagation();
                        updateBasedOnTouchPoints( currentPosition, "horizontal" );

                        return;
                    }*/

                    this.gestureStarted = true;
                    event.preventDefault();
                    event.stopPropagation();
                    updateBasedOnTouchPoints( currentPosition, dragDirection );




                }

            }




            function onTouchEnd(event) {
                console.log("touch end");
                gbStillTouching = false;

                if ( this.gestureStarted ) {
                    console.log("snaping");
                    snapToPosition();
                }
                this.gestureStarted = false;
                unbindEvents();
            }


            function updateBasedOnTouchPoints( currentPosition, direction ) {

                console.log("updateBasedOnTouchPoints: "+ direction);

                if (direction == "vertical"){
                   //VERTICAL


                    var deltaY = (currentPosition.y - gestureStartPosition.y);
                    var targetY = bodyOffset + deltaY;
                    console.log("targetY: " + targetY);
                    //targetX = Math.max( targetX, 0 );
                    //targetX = Math.min( targetX, sidebarWidth );

                    bodyOffset = targetY;

                    if ( $element.css("left") != "0px" ) {
                        $element.css("left", "0px" );
                    }
                    $element.css("-webkit-transform", "translate3d(0, " + targetY + "px,0)" );
                    $element.css("-moz-transform", "translate3d(0, " + targetY + "px,0)" );
                    $element.css("transform", "translate3d(0, " + targetY + "px,0)" );



                }else{
                   //HORIZONTAL
                    var deltaX = (currentPosition.x - gestureStartPosition.x);
                    var targetX = bodyOffset + deltaX;
                    console.log("targetX: " + targetX);
                    //targetX = Math.max( targetX, 0 );
                    //targetX = Math.min( targetX, sidebarWidth );

                    bodyOffset = targetX;

                    if ( $element.css("left") != "0px" ) {
                        $element.css("left", "0px" );
                    }
                    $element.css("-webkit-transform", "translate3d(" + targetX + "px,0,0)" );
                    $element.css("-moz-transform", "translate3d(" + targetX + "px,0,0)" );
                    $element.css("transform", "translate3d(" + targetX + "px,0,0)" );

                }





                checkPosition(targetX);

                //console.log( this.body.css("-moz-transform"), targetX );


                /*if ( currentPosition != targetX ) {

                 this.body.stop(true,false).animate({
                 left:targetX,
                 avoidTransforms:false,
                 useTranslate3d: true
                 }, 100);
                 }*/

               // this.sidebar.trigger( "slidingViewProgress", { current: targetX, max:this.sidebarWidth } );

                this.gestureStartPosition = currentPosition;
            }

            function checkPosition(pos){

                if ( pos > actionOpenWidth){
                    if (!$element.hasClass("todoDone")){
                        $element.addClass("todoDone");
                    }
                }else{
                    if ($element.hasClass("todoDone")){
                        $element.removeClass("todoDone");
                    }
                }
            }


            function snapToPosition() {

                gbMove = false;

                $element.css("left", "0px" );
                var currentPosition = bodyOffset;
                var halfWidth = sidebarWidth / 2;
                bodyOffset = 0;

                if( currentPosition < (-actionOpenWidth)) {
                    //DELETE
                    console.log("delete");
                    $element.remove();
                } else if ( currentPosition < actionOpenWidth ) {

                    //DO NOTHING
                    $element.css("-webkit-transform", "translate3d(0,0,0)" );
                    console.log("to short");
                    //Inview.app.model.set('isNavOpen', '0');
                    targetX = 0;
                    checkPosition(targetX);

                } else {
                    //COMPLETE
                    //$(this.el).css("-webkit-transform", "translate3d(0,0,0)" );
                    //Inview.app.model.set('isNavOpen', '1');
                    //targetX = sidebarWidth;
                    $element.css("-webkit-transform", "translate3d(0,0,0)" );
                    $element.addClass("todoCompleted");

                }
                //this.bodyOffset = targetX;

                //console.log( currentPosition, halfWidth, targetX );


            }



            function unbindEvents() {
                $element.unbind( this.MOVE_EVENT, this.touchMoveHandler, false );
                $element.unbind( this.END_EVENT, this.touchUpHandler, false );
            }



            function getTouchCoordinates(event) {
                if ( this.touchSupported ) {
                    var touchEvent = event.touches[0];
                    return { x:touchEvent.pageX, y:touchEvent.pageY }
                }
                else {
                    return { x:event.screenX, y:event.screenY };
                }
            }


            function resizeContent() {

                var $window = $(window)
                var w = $window.width();
                var h = $window.height();

                $element.width( w );
            }




        },
       //template: '<li ng-transclude></li>',
       replace: true



   };



});


/*

notSoClear.directive('todoBlur', function() {

    return function( scope, elem, attrs ) {
        console.log("in dir blur");
        elem.bind('blur', function() {
            scope.$apply(attrs.todoBlur);
        });
    };
});
 */