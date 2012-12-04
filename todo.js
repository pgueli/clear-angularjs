Number.prototype.between = function(first,last){
    return (first < last ? this >= first && this <= last : this >= last && this <= first);
}
Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};


function TodoCtrl($scope) {

    var ua = navigator.userAgent;
    $scope.isiPad = /iPad/i.test(ua) || /iPhone OS 3_1_2/i.test(ua) || /iPhone OS 3_2_2/i.test(ua);

    $scope.editedTodo = null;
    $scope.liHeight = 62;


    $scope.todos = [
        {
            title: 'Win the Falcon from Lando',
            done:false,
            liID: 1
        },
        {
            title: 'Kessel Run in less than 12 parsecs',
            done: false,
            liID: 2
        },
        {
            title: 'Avoid Greedo',
            done: false,
            liID: 3
        },
        {
            title: 'Pay off Jabba',
            done: false,
            liID: 4
        },
        {
            title: 'Save Luke',
            done: false,
            liID: 5
        },
        {
            title: 'Save Luke again',
            done: false,
            liID: 6
        },
        {
            title: 'Get frozen in carbinite',
            done: false,
            liID: 7
        }


    ];

    var todos = $scope.todos;


    $scope.delTodo = function( todo ){
        console.log("deleting: "+ todo.title);
        todos.splice(todos.indexOf(todo), 1);
    };


    $scope.editTodo = function( todo ){
        console.log("edit: "+ todo.title);
        $scope.editedTodo = todo;

        var indexOfEdit = $scope.todos.indexOf(todo);

        console.log("indexOfEdit: " + indexOfEdit);
        moveLIAmount = -($scope.liHeight * indexOfEdit);
        console.log(moveLIAmount);
        $("ul.notSoClear").addClass("movingUL");
        $("ul.notSoClear").css("-webkit-transform", "translate3d(0,"+moveLIAmount+"px,0)");

        $("ul.notSoClear li").css("opacity", ".25");
        $("ul.notSoClear li:nth-child("+(indexOfEdit+1)+")").css("opacity", "1");

    };

    $scope.addTodo = function(){
      $scope.todos.push({
          title:$scope.todoText,
          done: false
      });
      $scope.todoText = '';
    };



    $scope.doneEditing = function( todo ) {
        console.log("done edit");
        $("ul.notSoClear").css("-webkit-transform", "translate3d(0,0,0)");
        $scope.editedTodo = null;
        $("ul.notSoClear li").css("opacity", "1");
        if ( !todo.title ) {
            $scope.delTodo(todo);
        }
    };




    $scope.createNewLIItem = function(){
        //$scope.editedTodo = todos[numLI];

        var indexOfDone = 0;

        for(i=0; i < $scope.todos.length; i++) {
            if ($scope.todos[i].done == true) {
                indexOfDone = i;
                break;
            }else{
                indexOfDone = $scope.todos.length;
            }
            console.log($scope.todos[i].done);
        }

        console.log("indexOfDone: "+indexOfDone);

        $scope.todos.splice(indexOfDone, 0, {
            title:"",
            done: false
        });



        //move this LI to top
        numLI = indexOfDone;
        //numLI = $scope.todos.length-1;
        $scope.editedTodo = todos[numLI];
        $scope.$apply();

        moveLIAmount = -($scope.liHeight * numLI);
        console.log(moveLIAmount);
        $("ul.notSoClear").addClass("movingUL");
        $("ul.notSoClear").css("-webkit-transform", "translate3d(0,"+moveLIAmount+"px,0)");


    };



    function onBodyTouch(event) {
        console.log("onBodyTouch");
        $scope.createNewLIItem();
       // $scope.todos.move((liIndex-1),(newLIIndex-1));
       // $scope.$apply();


    }

    setupEventHandlers();
    function setupEventHandlers(){

        touchSupported =  ('ontouchstart' in window);
        START_EVENT = this.touchSupported ? 'touchstart' : 'mousedown';
        MOVE_EVENT = this.touchSupported ? 'touchmove' : 'mousemove';
        END_EVENT = this.touchSupported ? 'touchend' : 'mouseup';
        MOUSEOUT_EVENT = this.touchSupported ? 'mouseout' : 'mouseout';

        var func = function( event ){ onBodyTouch(event), true };
        $("#bodRst").bind(this.START_EVENT, func );



    }



}