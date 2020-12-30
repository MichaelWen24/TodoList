// add a new task
// delete a task
// delete all tasks
// toggle one task

// ~ 1. Show how many active tasks left at the left of footer
// 2. Three tabs in center of footer to toggle between All, Active, Completed and show filtered tasks
// ~ 3. Left header button to toggle all tasks. If any task is not completed, set all tasks to completed. If all tasks are completed, set all to active
// ~ 4. Type in the input, press enter key to add the task -> add event listener to 'keyup' and check if it is 'enter' key
// 5. Hover on task, shows pencil icon. Clicking pencil icon allows user to edit the task. Once editing is done, a checkmark icon allows user to save the editing
// 6. During editing, press enter key to save the task -> add event listener to 'keyup' and check if it is 'enter' key
// ~ 7. Close and reopen the application, it should keep all the previous tasks. // localStorage -> save to localStorage on each operation -> load from storage on initial load

// pencil html code: '&#9998;';
// checkmark html code: '&#10003;';

// hover and tab border color: pink

// model layer
const model = {
    // todo {checked: boolean, value: string, id: string}
    todoList: [],
    storedList: []
    // activeTab: 'ALL',
    // editingTask: "the task id"
  };
  
  function createId() {
    return new Date().toISOString();
  }
  
  function getTodoList() {
    return model.todoList;
  }
  
  // controllers
  
  function addNewTask() {
    const value = getAddInputValue();
    const checked = false;
    const newId = createId();
    const newTodo = {
      checked: checked,
      value: value,
      id: newId
    };
  
    model.todoList.push(newTodo);
    updateView();
  }
  
  function deleteAllTasks() {
    model.todoList = [];
    updateView();
  }
  
  function deleteTaskById(id) {
    const filteredList = model.todoList.filter(function (todo) {
      return todo.id !== id;
    });
    model.todoList = filteredList;
    updateView();
  }
  
  function toggleTaskById(id) {
    const newList = model.todoList.map(function (todo) {
      if (todo.id === id) {
        todo.checked = !todo.checked;
        return todo;
      } else {
        return todo;
      }
    });
    model.todoList = newList;
    updateView();
  }

  function toggleAllTasks() {
    const todoList = getTodoList();
    const newList = todoList.map(function (todo) {
        todo.checked = !todo.checked;
        return todo;
    });
    model.todoList = newList;
    updateView();
  }

  function setStoredTodos() {
    localStorage.setItem("todos", JSON.stringify(model.todoList));
  }

  // views
  
  function getListContainer() {
    return document.querySelector(".list-container");
  }
  
  function createTaskNode(value, checked, id) {
    const li = document.createElement("li");
  
    li.id = id;
  
    const input = document.createElement("input");
    input.setAttribute("type", "checkbox");
    input.checked = checked; // DOM API to set checked status
    // input.disabled = true;
  
    const span = document.createElement("span");
    if (checked) {
      span.classList.add("checked");
    }
    span.innerHTML = value;
    // if (checked) {
    //   span.classList.add("checked");
    // }
  
    const div1 = document.createElement("div");
    div1.innerHTML = "&#9998";
    div1.classList.add("edit-icon");

    const div2 = document.createElement("div");
    div2.innerHTML = "&#10005;";
    div2.classList.add("delete-icon");

    const div3 = document.createElement("div");
    div3.innerHTML = "&#10003";
    div3.classList.add("check-icon", "hide");
  
    li.appendChild(input);
    li.appendChild(span);
    li.appendChild(div1);
    li.appendChild(div2);
    // li.appendChild(div3);
    return li;
  }
  
  function updateList() {
    const listContainer = getListContainer();
  
    listContainer.innerHTML = "";
  
    const todoList = getTodoList();
    todoList.forEach(function (todo) {
      const liNode = createTaskNode(todo.value, todo.checked, todo.id);
      listContainer.appendChild(liNode);
    });
  }

  function displayAll() {
    updateView();
  }

//   function displayActive() {
//     const todoList = getTodoList();
//     const newList = todoList.map(function (todo) {
//         if(todo.checked === false){
//             return todo;
//         }  
//     });
//     model.todoList = newList;
//     updateView();
//   }
  
  function updateView() {
    updateList();
    updateTodosLeft();
    setStoredTodos();
    // console.log(getTodoList().length);
    // console.log(countTodosLeft());
  }
  
  function getAddInputValue() {
    const input = document.querySelector(".text-input");
    const inputValue = input.value;
    return inputValue;
  }

  function countTodos(){
    const todos = getTodoList();
    return todos.length;
  }

  function countTodosLeft() {
    const todoList = getTodoList();
    let todosLeft = countTodos();
    todoList.forEach(function(todo){
        if(todo.checked === true){
            todosLeft--;
        }
    });
    return todosLeft;
  }

  function updateTodosLeft() {
    const taskLabel = document.getElementById("task-label");
    taskLabel.textContent = `${countTodosLeft()} items left`;
  }

//   function toggleHideClass(target) {
//     if(target.classList.contains("hide")){
//         target.classList.remove("hide");
//     }
//     else{
//         target.classList.add("hide");
//     }
//   }

  function createEditNode(value, checked, id) {
    const li = document.createElement("li");
  
    li.id = id;
    console.log(li.id);
    const input = document.createElement("input");
    input.setAttribute("type", "checkbox");
    input.checked = checked; // DOM API to set checked status
    input.disabled = true;
  
    const span = document.createElement("span");
    span.classList.add("edit-span")
    span.textContent = `${value}`;
    
  
    const div1 = document.createElement("div");
    div1.innerHTML = "&#10003";
    div1.classList.add("check-icon");
  
    li.appendChild(input);
    li.appendChild(span);
    li.appendChild(div1);

    return li;
  }
  
  function handleContainerClick(e) {
    const target = e.target;

    // if (target.classList.contains("edit-icon")) {
    //     // target is the edit icon div
    //     const li = target.parentNode;
    //     const taskId = li.id;
    //     const todo = model.todoList.find(function (todo) {
    //         if (todo.id === taskId) {
    //           return todo;
    //         }
    //     });
    //     console.log(todo);
    //     createEditNode(todo.value, todo.checked, todo.id);
    //     return;
    //   }

    if (target.classList.contains("delete-icon")) {
      // target is the delete icon div
      const li = target.parentNode;
      const taskId = li.id;
      deleteTaskById(taskId);
      return;
    }
  
    if (
      target.tagName === "INPUT" &&
      target.getAttribute("type") === "checkbox"
    ) {
      const li = target.parentNode;
      const taskId = li.id;
      toggleTaskById(taskId);
      return;
    }
  }

  function loadEvents() {
    model.todoList = JSON.parse(localStorage.getItem("todos"));
    updateView();

    const toggleAll = document.querySelector("#select-all");
    const addButton = document.querySelector("#addButton");
    const inputEnter = document.querySelector("#text-input");
    const clearAllButton = document.querySelector("#clearButton");
    const allLabel = document.querySelector("#all-label");
    const activeLabel = document.querySelector("#active-label");
    const completedLabel = document.querySelector("#completed-label");
    const listContainer = getListContainer();

    toggleAll.addEventListener("click", toggleAllTasks);
    addButton.addEventListener("click", addNewTask);
    inputEnter.addEventListener("keyup", function(e) {
        if (e.key === "Enter"){
            addNewTask();
        }
    });
    clearAllButton.addEventListener("click", deleteAllTasks);
    allLabel.addEventListener("click", displayAll);
    // activeLabel.addEventListener("click", displayActive);
    listContainer.addEventListener("click", handleContainerClick);
  }
  
  loadEvents();
  