
// BUG change todo. click to edit, enter to confirm. BUG can only do it once...

// del img only shows when hover over that li


/** DATA **/

//represents the data and the methods to change the data
var todoList = {
    todos : [],
    add : function(par1){
      if (par1 != undefined){
          this.todos.push({
              todoText : par1,
              completed : false
          });
      }  
    },
    delete : function(par1){ //int position
        this.todos.splice(par1,1);
    },
    change : function(par1, par2, par3){ //int posn, string change, string previous
        if (par2 === undefined){
            //change it back to what it was
            this.todos[par1].todoText = par3;
        } else {
            //update array todoText at posn
            this.todos[par1].todoText = par2;
            console.log(par3 + " changed to " + par2 + "!");
        }
    },
    toggleComplete : function(par1) { //position in array
        this.todos[par1].completed = !this.todos[par1].completed;
    },
    toggleAll : function(){
        //check if all true(complete)
        var allTrue = true;
        this.todos.forEach(function(aTodo){
            if (aTodo.completed === false) {
                allTrue = false;
            }
        });
        
        //if allTrue(complete) make all false, otherwise make all true
        if (allTrue){
            this.todos.forEach(function(aTodo){
                aTodo.completed = false;
            });
        } else {
            this.todos.forEach(function(aTodo){
                aTodo.completed = true;
            });
        }
    },
    countIncomplete : function(){
        var cntNotDone = 0;
        this.todos.forEach(function(aTodo){
            if (aTodo.completed === false) {
                cntNotDone += 1;
            }
        })
        return cntNotDone;
    },
    clearComplete : function() {
                
        //when delete, the length changes!
        for (let i=0; i<todoList.todos.length; i++){
            if(todoList.todos[i].completed){
                todoList.delete(i);
                i -= 1; //the item is gone! length is -1, so we want i the same again. the loop plusses it, we want to decrease it.
                //for each cant handle it
            }
        }
    }
} //end todoList obj


/**  INTERACTION  **/
//no external function calls in base program, for testing, hence handlers here
//also, is this encapsulation?
var handlers = {
    addTodo : function(input) {
        todoList.add(input);
        addTodoTextInput.value = "";
        view.displayTodos("all"); //any time data changes 
    },
    //int posn, string change, string previous
    changeTodo : function(posn, newText, prevText){
        todoList.change(posn, newText, prevText);
        view.displayTodos("all");
    },
    deleteTodo : function(psn){
        todoList.delete(psn);
        view.displayTodos("all");
    },
    toggleComplete : function(psn){
        todoList.toggleComplete(psn);
        view.displayTodos("all");
    },
    toggleAll : function(){
        todoList.toggleAll();
        view.displayTodos("all");
    },
    clearComplete : function(){
        todoList.clearComplete();
        view.displayTodos("all");
    }
};

/** EVENT LISTENERS **/

var listeners = {
    //individual todo click functionality
    setUpEventListeners : function() {
        var todosUl = document.querySelector('ul');
        
        todosUl.addEventListener('click', function(evt){
            //console.log(evt.target.parentNode.id);

            //get el that was clicked on
            var elClicked = evt.target; //gets the el that was clicked. target is prop of event object (passed as arg)
            
            //check if el clicked was delete butn
            if (elClicked.className === "deleteBtn") {
                //run handlers . delete todo
                handlers.deleteTodo(parseInt(elClicked.parentNode.id)); //parent node is the li, which has unique id
            }
            //check if el clicked was toggleBox
            if(elClicked.className === "toggleBox"){
                //run handlers, toggle the box (by updating .completed prop in array)
                handlers.toggleComplete(parseInt(elClicked.parentNode.id));
            }
            
            //check if el clicked was toggleTitle
            if(elClicked.className === "todoTitle"){
                var prevText = elClicked.textContent; //on click, store the current text as var
                var posn = parseInt(elClicked.parentNode.id);
                
                //user will change whatever, then on enter update todoList.todos.todoTExt for this one
                
                document.querySelector('ul').addEventListener('keypress', function(evt){
                    var key = evt.which || evt.keycode;
                    if (key === 13){
                        var newText = elClicked.textContent;
                        handlers.changeTodo(posn, newText, prevText);
                    }
                })
                //when enter pressed, update the relevant item in todoList.todos, and close the focus thing
                //use handlers.changeTodo. text now in the p, the id of li
            }
        });
    },
    
    //add todo field enter
    addTodoEventListener : function() { 
        //set up listener for the addTodo input
        //when it is clicked, callback to start listening for enter
        //when enter pressed, take the text in there and run handlers.addTodo(text)
        
        var addTodo = document.querySelector('input');
        addTodo.addEventListener('keypress',function(evt){
            var key = evt.which || evt.keycode;
            if (key === 13){
                var newText = addTodoTextInput.value; //"big"; //textContent doesnt work
                handlers.addTodo(newText);
            };
        });
    },
    setUpClearCompleteEventListener : function() {
        //set listener for clear complete btn
        //when it is clicked, run todoList.clearComplete()
        var clearCompleteBtn = document.getElementById('clear-completed');
        clearCompleteBtn.addEventListener('click', function(){
            handlers.clearComplete();
        })
    },
    setUpSortBarEventListeners : function() {
        
        var sortAll = document.getElementById('sort-bar');
        sortAll.addEventListener('click', function(evt){
            var elClicked = evt.target;
            console.log(elClicked);
            
            if (elClicked.id === "all") {
                view.displayTodos("all");
                
                elClicked.classList.add('active-btn');
                document.getElementById('still-todo').classList.remove("active-btn");
                document.getElementById("done").classList.remove("active-btn");
                
            } else if (elClicked.id === "still-todo") {
                view.displayTodos("rem");
                
                elClicked.classList.add('active-btn');
                document.getElementById('all').classList.remove("active-btn");
                document.getElementById("done").classList.remove("active-btn");
                
            } else if (elClicked.id === "done") {
                view.displayTodos("done");
                
                elClicked.classList.add('active-btn');
                document.getElementById('all').classList.remove("active-btn");
                document.getElementById("still-todo").classList.remove("active-btn");
            }
            
        }) 
    }
};

/** VISUALISATION **/
var view = {
    displayTodos : function(sort) {
        
        var countRem = document.getElementById("cnt-remaining");
        countRem.textContent = todoList.countIncomplete() + ((todoList.todos.length === 1) ? " left!" : " items remaining");
        
        var actionBar = document.getElementById("action-bar");
        if(todoList.todos.length > 0){
            actionBar.classList.remove('invisible');
            actionBar.classList.add('visible');
        } else {
            actionBar.classList.remove('visible');
            actionBar.classList.add('invisible');
        }
        
        var todosUl = document.getElementById("todoUl");
        todosUl.innerHTML = ""; //clears the list before updating fresh , no doubles
        
        //each li gets a div inside it with class viewer, so we can give it clear: both
        
        todoList.todos.forEach(function(aTodo, posn){
            if (sort === "all") {
                createListItem();
                
            } else if (sort === "rem") {
                if (aTodo.completed === false) {
                    createListItem();
                }
                
            } else if (sort === "done") {
                if (aTodo.completed) {
                    createListItem();
                }
            }
            
            function createListItem() {
                var todoDiv = document.createElement("div");
                todoDiv.className = "view-div"; //because want to display contained elements as block
                var todoLi = document.createElement("li");
                todoLi.className = "todo-item";
                todoDiv.id = posn; //unique position
                todoDiv.appendChild(view.createToggleBox(aTodo.completed));
                todoDiv.appendChild(view.createTodoTitle(aTodo.todoText,aTodo.completed));
                todoDiv.appendChild(view.createDeleteBtn()); //if use this, refers to one func up. this is callback
                todoLi.appendChild(todoDiv);
                todoUl.appendChild(todoLi);
            }
        },this); //the this 2nd arg, allows the this within callback to skip 2 levels
    },
    
//    IN PROGRESS only display when min 1 todo
    //if todoList.todos.length > 0, change attribute display: none to display: block;
//    displayActionBar : function() {
//        
//    },
    
    
    createToggleBox : function(completed){
        var toggleBox = document.createElement("img");
        toggleBox.setAttribute('height','25px');
        toggleBox.setAttribute('width','25px');
        toggleBox.className = "toggleBox";
        
        if (completed) {
            toggleBox.setAttribute('src','assets/positive-512.png');
            toggleBox.setAttribute('alt','checked todo');
        } else {
            toggleBox.setAttribute('src','assets/128.png');
            toggleBox.setAttribute('alt','still todo');
        }
        return toggleBox;
    },
    createTodoTitle : function(text, bool) {
        var todoTitle = document.createElement("label");
        todoTitle.setAttribute('contenteditable','true');
        todoTitle.textContent = text;
        todoTitle.className = "todoTitle";
        if (bool === true){
            todoTitle.setAttribute('class','line-through');
        }
        return todoTitle;
    },
    createDeleteBtn : function(){ //create and return a button
        var deleteBtn = document.createElement("img");
        deleteBtn.setAttribute('src','assets/delete-icon-transparent.png');
        deleteBtn.setAttribute('alt','delete todo');
        deleteBtn.setAttribute('height','15px');
        deleteBtn.setAttribute('width','15px');
        deleteBtn.className = "deleteBtn"; //ev crtd el has this class
        return deleteBtn;
    }
};


listeners.setUpEventListeners();
listeners.addTodoEventListener();
listeners.setUpClearCompleteEventListener();
listeners.setUpSortBarEventListeners();


//TEST PROGRAM
//todoList.add("banana");

/* You can do tests like this in the chrome console
todoList.add("Hi");
todoList.add("banana");
todoList.delete("Hi");
todoList.display();
todoList.change("banana","apple");
todoList.change("Apple","Banana");
todoList.add("do this");
todoList.toggleComplete("Banana");
todoList.add("pineapple");
todoList.add("orange");
todoList.toggleAll();
todoList.toggleAll();
*/


//THEORY

/* 
*/
