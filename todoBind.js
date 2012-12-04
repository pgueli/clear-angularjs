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
            var liHeight = 62;
            var liIndex = 0;
            var liMoving = false;
            var newLIIndex = 0;
            var newLIIndexPrev = 0;
            var addLIIndex = 0;
            var moving = false;
            var msOut = false;
            var soundsComplete = ["sounds/ding-0.mp3", "sounds/ding-1.mp3", "sounds/ding-2.mp3", "sounds/ding-3.mp3", "sounds/ding-4.mp3"];
            var liIndexMult = 0;


            setupEventHandlers();




            function setupEventHandlers(){
                //console.log("in  setupEventHandlers;")
                touchSupported =  ('ontouchstart' in window);
                START_EVENT = this.touchSupported ? 'touchstart' : 'mousedown';
                MOVE_EVENT = this.touchSupported ? 'touchmove' : 'mousemove';
                END_EVENT = this.touchSupported ? 'touchend' : 'mouseup';
                MOUSEOUT_EVENT = this.touchSupported ? 'mouseout' : 'mouseout';


                $element.bind('click', function() {

                    if (!moving){
                        console.log("clicked");
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
                msOut = true;
                console.log("msOut: "+ msOut);
            }

            function onTouchStart(event) {
                console.log("onTouchStart");
                gbStillTouching = true;
                var originalTopPosition = getTouchCoordinates( event );
                var topY = originalTopPosition.y;
                console.log(topY);


                generateCheckandDelete($element[0].offsetTop);

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

                }

                this.gestureStartPosition = getTouchCoordinates( event );
                var self = this;
                this.touchMoveHandler = function( event ){ onTouchMove(event) };
                this.touchUpHandler = function( event ){ onTouchEnd(event) };
                this.mouseOutHandler = function( event ){ onMouseOut(event) };
                $element.bind( this.MOVE_EVENT, this.touchMoveHandler, false );
                $element.bind( this.END_EVENT, this.touchUpHandler, false );
                $element.bind( this.MOUSEOUT_EVENT, this.mouseOutHandler, false );

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
                    //msOut = false;
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

                    //for check
                    resetTranslate3D(".checkIcon");
                    resetTranslate3D(".deleteIcon");

                    if(targetX > 0){
                         $(".checkIcon").css("opacity", (targetX/actionOpenWidth));
                        if (targetX > actionOpenWidth ){
                            moveCheckX = targetX - actionOpenWidth;
                            $(".checkIcon").css("-webkit-transform", "translate3d(" + moveCheckX + "px,0,0)" );
                            $(".checkIcon").css("-moz-transform", "translate3d(" + moveCheckX + "px,0,0)" );
                            $(".checkIcon").css("transform", "translate3d(" + moveCheckX + "px,0,0)" );
                        }
                    }else{
                        //DELETE
                       // console.log(-targetX/actionOpenWidth);

                        $(".deleteIcon").css("opacity", (-targetX/actionOpenWidth));
                        if (targetX < (-actionOpenWidth) ){
                            moveDelX = targetX + actionOpenWidth;
                            $(".deleteIcon").css("-webkit-transform", "translate3d(" + moveDelX + "px,0,0)" );
                            $(".deleteIcon").css("-moz-transform", "translate3d(" + moveDelX + "px,0,0)" );
                            $(".deleteIcon").css("transform", "translate3d(" + moveDelX + "px,0,0)" );
                        }

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

            function generateCheckandDelete(yPos){
                $(".checkIcon").css("top", yPos +"px");
                $(".deleteIcon").css("top", yPos +"px");

            }

            soundCount = 1;


            function playCompleteAudio(){

                try {
                    console.log("soundCount: "+ soundCount);
                    playAudio(soundsComplete[soundCount]);
                    soundCount = soundCount + 1;
                    if (soundCount > 4) soundCount = 0;
                }catch(e){

                }
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


            function moveRestOfLIUp(fromLIIndex, toLIIndex, LIHght){
                //move rest of the items up
                $("li").addClass("movingLIUpOne");
                console.log(" moveRestOfLIUp(" + fromLIIndex + ", " + toLIIndex + ", " + LIHght + "); ");

                for (var i=(fromLIIndex); i < (toLIIndex); i++)
                {
                    $("#clearUL li:nth-child("+i+")").css("-webkit-transform", "translate3d(0," + (-LIHght) + "px,0)" );
                    $("#clearUL li:nth-child("+i+")").css("-moz-transform", "translate3d(0," + (-LIHght) + "px,0)" );
                    $("#clearUL li:nth-child("+i+")").css("transform", "translate3d(0," + (-LIHght) + "px,0)" );
                }
                //$("#clearUL li").removeClass("movingLIUpOne");

                setTimeout(function() {
                    resetTranslate3D(".checkIcon");
                    $("li").removeClass("movingLIUpOne");
                 //   resetTranslate3D("li");
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

                    //$("#clearUL li").css("-webkit-transform", "translate3d(0,0,0)" );
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
                        //moveRestOfLIUp(liIndex, lastIndex, liHeight);
                        //shift row to the left
                        screenWidth = $(window).width();
                        $element.css("-webkit-transform", "translate3d(-"+screenWidth+"px,0,0)" );
                        $(".checkIcon").css("opacity", "0");
                        $(".deleteIcon").addClass("shiftingLIHorz").css("-webkit-transform", "translate3d(-"+screenWidth+"px,0,0)");

                        $scope.todos.splice(liIndex,1);
                        //$scope.$apply();
                       // setTimeout(function() {$scope.$apply();}, 1500);
                        setTimeout(function() {
                            //$element.remove();
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
                        console.log("to short");
                        $element.removeClass("shiftingLIHorz");
                        $element.css("-webkit-transform", "translate3d(0,0,0)" );

                        targetX = 0;
                        checkPosition(targetX);

                    } else {
                        //COMPLETE
                        //$(this.el).css("-webkit-transform", "translate3d(0,0,0)" );
                        //Inview.app.model.set('isNavOpen', '1');
                        //targetX = sidebarWidth;
                        //var otherLI = $("#clearUL li:nth-child("+liIndex+")");

                        resetTranslate3D(".checkIcon");
                        $(".checkIcon").css("opacity", "0");

                        count = 0
                        $element.bind("webkitTransitionEnd oTransitionEnd otransitionend transitionend msTransitionEnd", function(){

                            if(count == 0){
                                $element.addClass("todoCompleted");

                                playCompleteAudio();
                                console.log(liIndex);
                                console.log($scope.todos[liIndex]);


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
                                moveRestOfLIUp(liIndex+2, lastIndex+1, liHeight);



                                setTimeout(function() {reOrder();}, 500);

                                function reOrder(){
                                    $element.removeClass("shiftingLIHorz");
                                    $element.removeClass("shiftingLIDelete");
                                    //$("#clearUL li").css("-webkit-transform", "translate3d(0,0,0)" );
                                    resetTranslate3D("#clearUL li");
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