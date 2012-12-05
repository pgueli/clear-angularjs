notSoClear.directive('gfTap', function() {

   return{
       //transclude: true,
       //scope: {},
        controller: function($scope, $element, $attrs){



            var gestureStarted = false;
            var bodyOffset = 0;
            var sidebarWidth = 240;
            var actionOpenWidth = 70;
            var gnStartTime = 0;
            var gbMove = false;
            var gbStillTouching = false;
            var dragDirection = "horizontal"; //horizontal || vertical
            var onHoldDelay = 1000; //ms
            var liHeight = $scope.liHeight;
            var liIndex = 0;
            var liMoving = false;
            var newLIIndex = 0;
            var newLIIndexPrev = 0;
            var addLIIndex = 0;
            var moving = false;
            var msOut = false;
            var soundsComplete = ["sounds/ding-0.mp3", "sounds/ding-1.mp3", "sounds/ding-2.mp3", "sounds/ding-3.mp3", "sounds/ding-4.mp3"];
            var soundsSwish = "sounds/delete2.mp3";
            var liIndexMult = 0;
            var playedClick = false;


            setupEventHandlers();

            function setupEventHandlers(){
                touchSupported =  ('ontouchstart' in window);
                START_EVENT = this.touchSupported ? 'touchstart' : 'mousedown';
                MOVE_EVENT = this.touchSupported ? 'touchmove' : 'mousemove';
                END_EVENT = this.touchSupported ? 'touchend' : 'mouseup';
                MOUSEOUT_EVENT = this.touchSupported ? 'mouseout' : 'mouseout';

                $element.bind('click', function() {
                    if (!moving){
                        return $scope.$apply($attrs['gfTap']);
                        //return tapping = true;
                    }
                });

                var self = this;
                var func = function( event ){ onTouchStart(event), true };

                $element.bind(this.START_EVENT,func );
            }


            function beginDragVert(){
                dragDirection = "vertical";
                $element.addClass("todoDragVert");
            }

            function onMouseOut(event) {
                return msOut;
            }

            function onTouchStart(event) {
                gbStillTouching = true;
                var originalTopPosition = getTouchCoordinates( event );
                var topY = originalTopPosition.y;

                liIndex = $('#clearUL li').index($element[0]);
                liIndex = liIndex + 1;
                isDone = $scope.todos[liIndex-1].done;

                generateCheckandDelete($element[0].offsetTop);

                gnStartTime = Number(new Date());
                setTimeout(function() {
                    checkTapHold(gnStartTime);clearTimeout();
                },onHoldDelay);

                function checkTapHold(nID) {
                    if ((!gbMove) && (gbStillTouching) && (gnStartTime == nID)) {
                        gnStartTime = 0;
                        gbMove = false;
                        beginDragVert();
                    }

                    liIndex = $('#clearUL li').index($element[0]);
                    liIndex = liIndex + 1;
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
                gbStillTouching = false;

                if ( this.gestureStarted ) {
                    snapToPosition();
                }
                this.gestureStarted = false;
                unbindEvents();
            }




            function updateBasedOnTouchPoints( currentPosition, direction ) {


                if (direction == "vertical"){
                   //VERTICAL
                    var deltaY = (currentPosition.y - gestureStartPosition.y);
                    var targetY = bodyOffset + deltaY;

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


                    function moveLI(elemIndex, moveY){
                        var oldLIIndex = elemIndex;
                        var moveIndex = elemIndex;

                        playAudio("sounds/j" + (moveIndex+2) + ".mp3");

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

                    if(  (targetX.between(-5,5)) && (targetY.between(-3,3)) ){
                        gbMove = false;
                    }else{
                        gbMove = true;
                    }

                    //for check
                    resetTranslate3D(".checkIcon");
                    resetTranslate3D(".deleteIcon");

                    if(targetX > 0){
                        $(".deleteIcon").css("opacity", 0);

                        if(isDone){
                            $(".checkIcon").css("opacity", (1-(targetX/actionOpenWidth)));

                            if (targetX > actionOpenWidth ){
                                $element.removeClass("todoCompleted");
                                $element.removeClass("todoDone");

                                moveCheckX = targetX - actionOpenWidth;
                                $(".checkIcon").css("-webkit-transform", "translate3d(" + moveCheckX + "px,0,0)" );
                                $(".checkIcon").css("-moz-transform", "translate3d(" + moveCheckX + "px,0,0)" );
                                $(".checkIcon").css("transform", "translate3d(" + moveCheckX + "px,0,0)" );
                            }

                        }else{
                            $(".checkIcon").css("opacity", (targetX/actionOpenWidth));
                            if (targetX > actionOpenWidth ){
                                $element.addClass("todoDone");

                                if (playedClick == false){
                                    playAudio("sounds/click2-on.mp3");
                                    playedClick = true;
                                }

                                moveCheckX = targetX - actionOpenWidth;
                                $(".checkIcon").css("-webkit-transform", "translate3d(" + moveCheckX + "px,0,0)" );
                                $(".checkIcon").css("-moz-transform", "translate3d(" + moveCheckX + "px,0,0)" );
                                $(".checkIcon").css("transform", "translate3d(" + moveCheckX + "px,0,0)" );
                            }else{

                                if (playedClick == true){
                                    playAudio("sounds/click2-off.mp3");
                                    playedClick = false;
                                }
                            }
                        }


                    }else{
                        //DELETE
                        $(".deleteIcon").css("opacity", (-targetX/actionOpenWidth));
                        if (targetX < (-actionOpenWidth) ){
                            moveDelX = targetX + actionOpenWidth;
                            $(".deleteIcon").css("-webkit-transform", "translate3d(" + moveDelX + "px,0,0)" );
                            $(".deleteIcon").css("-moz-transform", "translate3d(" + moveDelX + "px,0,0)" );
                            $(".deleteIcon").css("transform", "translate3d(" + moveDelX + "px,0,0)" );
                        }

                    }


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

                    if(msOut){
                       //console.log("snapping");
                       //snapToPosition();
                    }


                }

                checkPosition(targetX);
                this.gestureStartPosition = currentPosition;
            }

            function resetTranslate3D(el){
                $(el).css("-webkit-transform", "translate3d(0,0,0)");
                $(el).css("-moz-transform", "translate3d(0,0,0)");
                $(el).css("transform", "translate3d(0,0,0)");
            }


            function playAudio(url) {
                try {
                    var my_media = new Media(url);
                    // Play audio
                    my_media.play();
                }catch(e){}
            }

            function generateCheckandDelete(yPos){
                $(".checkIcon").css("top", yPos +"px");
                $(".deleteIcon").css("top", yPos +"px");

            }

            soundCount = 3;
            function playCompleteAudio(){
                try {
                    playAudio("sounds/j" + soundCount + ".mp3");
                    soundCount = soundCount + 1;
                    if (soundCount > 10) soundCount = 3;
                }catch(e){}
            }

            function checkPosition(pos){

                if ( pos > actionOpenWidth){
                }else{
                    if ($element.hasClass("todoDone")){
                        $element.removeClass("todoDone");
                    }
                }
            }


            function moveRestOfLIUp(fromLIIndex, toLIIndex, LIHght){
                //move rest of the items up
                $("li").addClass("movingLIUpOne");

                for (var i=(fromLIIndex); i < (toLIIndex); i++)
                {
                    $("#clearUL li:nth-child("+i+")").css("-webkit-transform", "translate3d(0," + (-LIHght) + "px,0)" );
                    $("#clearUL li:nth-child("+i+")").css("-moz-transform", "translate3d(0," + (-LIHght) + "px,0)" );
                    $("#clearUL li:nth-child("+i+")").css("transform", "translate3d(0," + (-LIHght) + "px,0)" );
                }

                setTimeout(function() {
                    resetTranslate3D(".checkIcon");
                    $("li").removeClass("movingLIUpOne");
                }, 500);

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
                    resetTranslate3D("#clearUL li");
                    $element.removeClass("todoDragVert");

                    $scope.todos.move((liIndex-1),(newLIIndex-1));
                    $scope.$apply();



                }else{
                    //HORIZONTAL
                    $element.addClass("shiftingLIHorz");
                    liIndex = $('#clearUL li').index($element[0]);
                    lastIndex = $scope.todos.length;


                    if( currentPosition < (-actionOpenWidth)) {


                        //DELETE
                        //shift row to the left
                        screenWidth = $(window).width();
                        $element.css("-webkit-transform", "translate3d(-"+screenWidth+"px,0,0)" );
                        $(".checkIcon").css("opacity", "0");
                        $(".deleteIcon").addClass("shiftingLIHorz").css("-webkit-transform", "translate3d(-"+screenWidth+"px,0,0)");

                        playAudio(soundsSwish);

                        $scope.todos.splice(liIndex,1);
                        setTimeout(function() {
                            $(".deleteIcon").removeClass("shiftingLIHorz");
                            //shift rows up
                            moveRestOfLIUp(liIndex+2, lastIndex+1, liHeight);
                        }, 200);

                        setTimeout(function() {
                            $("li").removeClass("movingLIUpOne");
                            resetTranslate3D("li");
                            $scope.$apply();

                        }, 600);

                    } else if ( currentPosition < actionOpenWidth ) {

                        //DO NOTHING
                        $(".checkIcon").css("opacity", "0");
                        $(".deleteIcon").css("opacity", "0");
                        $element.removeClass("shiftingLIHorz");
                        $element.css("-webkit-transform", "translate3d(0,0,0)" );

                        targetX = 0;
                        checkPosition(targetX);

                    } else {

                        resetTranslate3D(".checkIcon");
                        $(".checkIcon").css("opacity", "0");

                        count = 0
                        $element.bind("webkitTransitionEnd oTransitionEnd otransitionend transitionend msTransitionEnd", function(){

                            if(count == 0){
                                $element.addClass("todoCompleted");

                                playCompleteAudio();

                                lastIndexB = lastIndex - 1;
                                liIndexB = liIndex ;

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
                                moveRestOfLIUp(liIndex+2, lastIndex+1, liHeight);

                                setTimeout(function() {reOrder();}, 500);

                                function reOrder(){
                                    $element.removeClass("shiftingLIHorz");
                                    $element.removeClass("shiftingLIDelete");
                                    resetTranslate3D("#clearUL li");
                                    $scope.todos.move(liIndexB, lastIndexB);
                                    $scope.$apply();
                                }

                                ++count;
                            }


                        });
                        $element.css("-webkit-transform", "translate3d(0,0,0)" );


                    }

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
       replace: true



   };



});
