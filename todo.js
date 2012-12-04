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

    $scope.editedTodo = null;
   // $scope.showingEdit = true;

    $scope.todos = [
        {
            title: 'learn angular',
            done:false,
            liID: 1
        },
        {
            title: 'build an app',
            done: false,
            liID: 2
        },
        {
            title: 'another item 1',
            done: false,
            liID: 3
        },
        {
            title: 'another item 2',
            done: false,
            liID: 3
        },
        {
            title: 'another item 3',
            done: false,
            liID: 3
        },
        {
            title: 'another item 4 ',
            done: false,
            liID: 3
        },
        {
            title: 'another item 5',
            done: false,
            liID: 3
        },
        {
            title: 'another item 6',
            done: false,
            liID: 3
        },
        {
            title: 'another item  7',
            done: false,
            liID: 3
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
        $scope.editedTodo = null;
        if ( !todo.title ) {
            $scope.removeTodo(todo);
        }
    };



}