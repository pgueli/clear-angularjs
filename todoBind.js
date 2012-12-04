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
        controller: function($scope, $element, $attrs){















           // console.log("edit: "+ todo.title);
           // $scope.editedTodo = todo;



           // console.log($element);

            var gestureStarted = false;
            var bodyOffset = 0;
            var sidebarWidth = 240;
            var actionOpenWidth = 70;
            var gnStartTime = 0;
            var gbMove = false;
            var gbStillTouching = false;
            var dragDirection = "horizontal"; //horizontal || vertical
            var onHoldDelay = 1000; //ms
            var liHeight = 62;
            var liIndex = 0;
            var liMoving = false;
            var newLIIndex = 0;
            var newLIIndexPrev = 0;
            var addLIIndex = 0;
            var moving = false;


            var liIndexMult = 0;

            setupEventHandlers();

            function setupEventHandlers(){
                //console.log("in  setupEventHandlers;")
                touchSupported =  ('ontouchstart' in window);
                START_EVENT = this.touchSupported ? 'touchstart' : 'mousedown';
                MOVE_EVENT = this.touchSupported ? 'touchmove' : 'mousemove';
                END_EVENT = this.touchSupported ? 'touchend' : 'mouseup';












                $element.bind('click', function() {

                    if (!moving){
                        console.log("clicked");
                        return $scope.$apply($attrs['gfTap']);
                        //return tapping = true;
                    }
                });

                /*$element.bind('touchstart', function() {
                    console.log("touchstart");
                    return tapping = true;
                });

                return $element.bind('touchend', function() {
                    console.log("touchend");
                    if (tapping) {
                        return $scope.$apply($attrs['gfTap']);
                    }
                });
                */





                var self = this;
                var func = function( event ){ onTouchStart(event), true };

                $element.bind(this.START_EVENT,func );
               // mainArea.addEventListener( this.START_EVENT, func, false );
            }


            function beginDragVert(){
                console.log("in begin drag vert.")
                dragDirection = "vertical";
                $element.addClass("todoDragVert");

            }


            function onTouchStart(event) {
                console.log("onTouchStart");


                console.log( event.type );
                gbStillTouching = true;

                var originalTopPosition = getTouchCoordinates( event );
                var topY = originalTopPosition.y;
                console.log(topY);


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

                    liIndex = $('#clearUL li').index($element[0]);
                    liIndex = liIndex + 1;
                    //var tt = $element[0].offsetTop / liHeight;

                    console.log("origial liIndex: "+ liIndex);

                }


                this.gestureStartPosition = getTouchCoordinates( event );

                var self = this;
                this.touchMoveHandler = function( event ){ onTouchMove(event) };
                this.touchUpHandler = function( event ){ onTouchEnd(event) };

                $element.bind( this.MOVE_EVENT, this.touchMoveHandler, false );
                $element.bind( this.END_EVENT, this.touchUpHandler, false );


            }

             function onTouchMove(event) {

                //gbMove = true;
                var currentPosition = getTouchCoordinates( event );

                if ( this.gestureStarted ) {
                    event.preventDefault();
                    event.stopPropagation();
                    updateBasedOnTouchPoints( currentPosition, dragDirection );
                    return;
                }
                else {

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

                //console.log("updateBasedOnTouchPoints: "+ direction);

                if (direction == "vertical"){
                   //VERTICAL


                    var deltaY = (currentPosition.y - gestureStartPosition.y);
                    var targetY = bodyOffset + deltaY;
                    console.log("targetY: " + targetY);

                    if(targetY.between(-2,2)){
                        moving = false;
                    }else{
                        moving = true;
                    }



                    bodyOffset = targetY;

                    if ( $element.css("left") != "0px" ) {
                        $element.css("left", "0px" );
                    }
                    $element.css("-webkit-transform", "translate3d(0, " + targetY + "px,0)" );
                    $element.css("-moz-transform", "translate3d(0, " + targetY + "px,0)" );
                    $element.css("transform", "translate3d(0, " + targetY + "px,0)" );






                    var np = Math.floor( (targetY+30) / 62 );

                    if (np==0){
                        newLIIndex = liIndex;
                        if (!liMoving){ newLIIndexPrev = liIndex;}
                    }

                    if (  ((np) && (np != addLIIndex)) || ((liMoving==true) && (np==0))  ){
                        liMoving = true;
                        addLIIndex = np;
                        newLIIndex = liIndex + addLIIndex;


                        if ( (newLIIndex > newLIIndexPrev) && (newLIIndex > liIndex)){
                            //moving down greater than orgin
                            moveLI(newLIIndex, -62);

                        }else if ( (newLIIndex > newLIIndexPrev) && (newLIIndex < liIndex)){
                            //moving down less than orgin
                            moveLI(newLIIndexPrev, 0);

                        }else if ( (newLIIndex > newLIIndexPrev) && (newLIIndex == liIndex)){
                            //moving down at orgin
                            moveLI(newLIIndexPrev, 0);

                        }else if ((newLIIndex < newLIIndexPrev) && (newLIIndex < liIndex) ){
                            //moving up less than orign
                            moveLI(newLIIndex, 62);

                        }else if ((newLIIndex < newLIIndexPrev) && (newLIIndex > liIndex) ){
                            //moving up greater than orign
                            moveLI(newLIIndexPrev, 0);

                        }else if ((newLIIndex < newLIIndexPrev) && (newLIIndex == liIndex) ){
                            //moving up at orign
                            moveLI(newLIIndexPrev, 0);
                        }



                    }



                    console.log("liIndex: "+liIndex+ "; newLIIndex: "+newLIIndex+"; newLIIndexPrev: "+newLIIndexPrev );


                    function moveLI(elemIndex, moveY){
                        var oldLIIndex = elemIndex;
                        var moveIndex = elemIndex;



                        console.log("**********************moveIndex: "+ moveIndex);
                        console.log("******* liIndex: "+liIndex+ "; newLIIndex: "+newLIIndex+"; newLIIndexPrev: "+newLIIndexPrev );

                        //liIndex
                        var otherLI = $("#clearUL li:nth-child(" + moveIndex + ")");

                        otherLI.addClass("shiftingLI");
                        otherLI.css("-webkit-transform", "translate3d(0, " + moveY + "px,0)" );
                        otherLI.css("-moz-transform", "translate3d(0, " + moveY + "px,0)" );
                        otherLI.css("transform", "translate3d(0, " + moveY + "px,0)" );

                        newLIIndexPrev = newLIIndex;

                    }



                }else{
                   //HORIZONTAL
                    var deltaX = (currentPosition.x - gestureStartPosition.x);
                    var deltaY = (currentPosition.y - gestureStartPosition.y);

                    var targetX = bodyOffset + deltaX;
                    var targetY = bodyOffset + deltaY;

                    console.log("targetX: " + targetX + "; targetY: " + targetY);



                    if(  (targetX.between(-5,5)) && (targetY.between(-3,3)) ){
                        gbMove = false;
                    }else{
                        gbMove = true;
                    }

                    //$element.append("<span>askajksj</span>");

                    if(targetX.between(-2,2)){
                        moving = false;
                    }else{
                        moving = true;
                    }


                    bodyOffset = targetX;

                    if ( $element.css("left") != "0px" ) {
                        $element.css("left", "0px" );
                    }
                    $element.css("-webkit-transform", "translate3d(" + targetX + "px,0,0)" );
                    $element.css("-moz-transform", "translate3d(" + targetX + "px,0,0)" );
                    $element.css("transform", "translate3d(" + targetX + "px,0,0)" );

                }

                checkPosition(targetX);

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

                if(dragDirection == "vertical"){
                    $('#clearUL li').removeClass("shiftingLI");
                    var newY = (liHeight * (newLIIndex-2));
                    $element.css("-webkit-transform", "translate3d(0," + newY + "px,0)" );
                    $element.css("-moz-transform", "translate3d(0," + newY + "px,0)" );
                    $element.css("transform", "translate3d(0," + newY + "px,0)" );

                    dragDirection = "horizontal";

                    $("#clearUL li").css("-webkit-transform", "translate3d(0,0,0)" );
                    $element.removeClass("todoDragVert");

                    $scope.todos.move((liIndex-1),(newLIIndex-1));
                    $scope.$apply();



                }else{
                    //HORIZONTAL
                    $element.addClass("shiftingLIHorz");

                    if( currentPosition < (-actionOpenWidth)) {

                        //DELETE
                        liIndex = $('#clearUL li').index($element[0]);
                        $scope.todos.splice(liIndex,1);
                        $scope.$apply();


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

                        //var otherLI = $("#clearUL li:nth-child("+liIndex+")");


                        liIndex = $('#clearUL li').index($element[0]);
                        count = 0
                        $element.bind("webkitTransitionEnd oTransitionEnd otransitionend transitionend msTransitionEnd", function(){

                            if(count == 0){
                                $element.addClass("todoCompleted");

                                purl  = "ding.mp3"
                                playAudio(purl);
                                function playAudio(purl) {
                                    // Play the audio file at url
                                    var my_media = new Media(url,
                                        // success callback
                                        function() {
                                            console.log("playAudio():Audio Success");
                                        },
                                        // error callback
                                        function(err) {
                                            console.log("playAudio():Audio Error: "+err);
                                        });

                                    // Play audio
                                    my_media.play();
                                }




                                console.log(liIndex);
                                console.log($scope.todos[liIndex]);

                                lastIndex = $scope.todos.length;
                                lastIndexB = lastIndex - 1;
                                liIndexB = liIndex ;

                                console.log(lastIndex);
                                $scope.todos[liIndex].done = true;
                                $scope.$apply();

                                //move completed item doen to bottom
                                newY =(liHeight * (lastIndex-liIndex));
                                newY = newY - liHeight;
                                $element.css("-webkit-transform", "translate3d(0," + newY + "px,0)" );
                                $element.css("-moz-transform", "translate3d(0," + newY + "px,0)" );
                                $element.css("transform", "translate3d(0," + newY + "px,0)" );

                                $element.addClass("shiftingLIDelete");
                                $element.removeClass("shiftingLIHorz");

                                //move rest of the items up
                                for (var i=(liIndex+2); i < (lastIndex+1); i++)
                                {
                                    $("#clearUL li:nth-child("+i+")").css("-webkit-transform", "translate3d(0," + (-liHeight) + "px,0)" );
                                    $("#clearUL li:nth-child("+i+")").css("-moz-transform", "translate3d(0," + (-liHeight) + "px,0)" );
                                    $("#clearUL li:nth-child("+i+")").css("transform", "translate3d(0," + (-liHeight) + "px,0)" );
                                }


                                setTimeout(function() {reOrder();}, 500);

                                function reOrder(){
                                    $element.removeClass("shiftingLIHorz");
                                    $element.removeClass("shiftingLIDelete");
                                    $("#clearUL li").css("-webkit-transform", "translate3d(0,0,0)" );
                                    console.log(".move("+liIndexB+","+lastIndexB+");");
                                    $scope.todos.move(liIndexB, lastIndexB);
                                    $scope.$apply();
                                }

                                ++count;
                            }

                            //$element.unbind("webkitTransitionEnd oTransitionEnd otransitionend transitionend msTransitionEnd", this, false);

                        });
                        $element.css("-webkit-transform", "translate3d(0,0,0)" );


                    }
                    //this.bodyOffset = targetX;

                    //console.log( currentPosition, halfWidth, targetX );
                }


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