function TodoCtrl($scope) {

    $scope.editedTodo = null;
   // $scope.showingEdit = true;

    $scope.todos = [
        {
            title: 'learn angular',
            done:true,
            liID: 1
        },
        {
            title: 'build an app',
            done: false,
            liID: 2
        },
        {
            title: 'another item',
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