// add a new task
// delete a task
// delete all tasks
// toggle one task

// ~ 1. Show how many active tasks left at the left of footer
// ~ 2. Three tabs in center of footer to toggle between All, Active, Completed and show filtered tasks
// ~ 3. Left header button to toggle all tasks. If any task is not completed, set all tasks to completed. If all tasks are completed, set all to active
// ~ 4. Type in the input, press enter key to add the task -> add event listener to 'keyup' and check if it is 'enter' key
// ~ 5. Hover on task, shows pencil icon. Clicking pencil icon allows user to edit the task. Once editing is done, a checkmark icon allows user to save the editing
// ~ 6. During editing, press enter key to save the task -> add event listener to 'keyup' and check if it is 'enter' key
// ~ 7. Close and reopen the application, it should keep all the previous tasks. // localStorage -> save to localStorage on each operation -> load from storage on initial load

// pencil html code: '&#9998;';
// checkmark html code: '&#10003;';

// hover and tab border color: pink

// model layer
const TABS = {
  ALL: "ALL",
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED"
}
const model = {
    // todo {checked: boolean, value: string, id: string}
    todoList: [],
    activeTab: TABS.ALL,
    editingTask: null
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

  function toggleEdting(todoId, value, isEditing) {
    model.todoList = model.todoList.map((todo) => {
      if (todo.id === todoId) {
        return { ...todo, value: value };
      } else {
        return todo;
      }
    });
    if (isEditing) {
      model.editingTask = todoId;
    } else {
      model.editingTask = null;
    }
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
    let checkedTodo = 0;
    let newList = [];
    todoList.map(function(todo){
      if(todo.checked === true) {
        checkedTodo ++;
      }
    });

    if(todoList.length === checkedTodo){
      newList = todoList.map(function (todo) {
        todo.checked = !todo.checked;
        return todo;
      });
    }
    else{
      newList = todoList.map(function (todo) {
        if(todo.checked === false){
          todo.checked = !todo.checked;
        }
        return todo;
      });
    }
    model.todoList = newList;
    updateView();
  }

  // function handleToggleAll() {
  //   const hasAnyUncompleted = model.todoList.some((todo) => {
  //     return !todo.checked;
  //   });
  //   model.todoList = model.todoList.map((todo) => {
  //     return { ...todo, checked: hasAnyUncompleted };
  //   });
  //   updateView();
  // }

  function setStoredTodos() {
    localStorage.setItem("todos", JSON.stringify(model.todoList));
  }

  // views
  
  function getListContainer() {
    return document.querySelector(".list-container");
  }
  
  function createTaskNode(value, checked, id) {
    const editTodoId = model.editingTask;
    const isEditing = editTodoId === id;
    const li = document.createElement("li");
  
    li.id = id;
  
    const input = document.createElement("input");
    input.setAttribute("type", "checkbox");
    input.checked = checked; // DOM API to set 
  
    const span = document.createElement("span");
    if (checked) {
      span.classList.add("checked");
    }
    span.innerHTML = value;

    li.appendChild(input);  
  
    if (isEditing) {
      input.disabled = true;
      const editInput = document.createElement("input");
      editInput.className = "edit-input";
      const checkDiv = document.createElement("div");
      checkDiv.innerHTML = "&#10003;";
      checkDiv.classList.add("check-icon");
      editInput.value = value;

      li.appendChild(editInput);
      li.appendChild(checkDiv);

    } else {

      li.appendChild(span);

      const editDiv = document.createElement("div");
      editDiv.innerHTML = "&#9998";
      editDiv.classList.add("edit-icon");

      const deleteDiv = document.createElement("div");
      deleteDiv.innerHTML = "&#10005;";
      deleteDiv.classList.add("delete-icon");

      li.appendChild(editDiv);
      li.appendChild(deleteDiv);
    }
    return li;
  }
  
  function updateList() {
    const listContainer = getListContainer();
  
    listContainer.innerHTML = "";
  
    const todoList = getTodoList();

    const activeTab = model.activeTab;

    const validTodoList = todoList.filter((todo) => {
      if (activeTab === TABS.ALL){
        return true;
      }
      // if (activeTab === TABS.ACTIVE){
      //   return !todo.checked;
      // }
      if (activeTab === TABS.ACTIVE && todo.checked === false) {
        return todo;
      }
      // if (activeTab === TABS.COMPLETED){
      //   return todo.checked;
      // }
      if (activeTab === TABS.COMPLETED && todo.checked === true) {
        return todo;
      } 
    })
    validTodoList.forEach(function (todo) {
      const liNode = createTaskNode(todo.value, todo.checked, todo.id);
      listContainer.appendChild(liNode);
    });
  }

  function updateTab() {
    const tabs = document.querySelectorAll(".tab");
    const activeTab = model.activeTab;
    tabs.forEach((tab) =>{
      if(tab.getAttribute("name") === activeTab){ 
        tab.className = 'tab active';
      }
      else {
        tab.className = 'tab';
      }
    });
  }
  
  function updateView() {
    updateList();
    updateTodosLeft();
    updateTab();
    setStoredTodos();
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
    taskLabel.textContent = `${countTodosLeft()} ${
      countTodosLeft() === 1 ? "item" : "items"} left`;
  }
  
  function handleTabClick(e) {
    const tabName = e.target.getAttribute("name");
    model.activeTab = tabName;
    updateView();
  }

  function handleAddTaskByKey(e) {
    if (e.key === "Enter") {
      addNewTask();
    }
  }

  function handleConfirmByKey(e) {
    if (e.key === "Enter") {
      const editInput = getListContainer().querySelector(".edit-input");
      const value = editInput.value;
      const li = editInput.parentNode;
      toggleEdting(li.id, value, false);
    }
  }

  function handleContainerClick(e) {
    const target = e.target;

    if (target.classList.contains("edit-icon")) {
        // target is the edit icon div
        const li = target.parentNode;
        const taskId = li.id;
        const targetTodo = model.todoList.find((todo) => todo.id === taskId);
        toggleEdting(targetTodo.id, targetTodo.value, true);
        return;
      }

      if (target.classList.contains("check-icon")) {
        const li = target.parentNode;
        const editInput = li.querySelector(".edit-input");
        const value = editInput.value;
        const taskId = li.id;
        const targetTodo = model.todoList.find((todo) => todo.id === taskId);
        toggleEdting(targetTodo.id, value, false);
        return;
      }

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
    if (localStorage.getItem("todos") === null) {
      const newTodo = {
        checked: false,
        value: "This is your first item",
        id: createId()
      }
      model.todoList.push(newTodo);
      updateView();
    } else {
      model.todoList = JSON.parse(localStorage.getItem("todos"));
      updateView();
    }
    
    const toggleAll = document.querySelector("#select-all");
    const addButton = document.querySelector("#addButton");
    const inputEnter = document.querySelector("#text-input");
    const clearAllButton = document.querySelector("#clearButton");
    const tabContiner = document.querySelector(".tabs");
    const listContainer = getListContainer();

    toggleAll.addEventListener("click", toggleAllTasks);
    addButton.addEventListener("click", addNewTask);
    inputEnter.addEventListener("keyup", handleAddTaskByKey);
    clearAllButton.addEventListener("click", deleteAllTasks);
    tabContiner.addEventListener("click", handleTabClick);
    listContainer.addEventListener("click", handleContainerClick);
    listContainer.addEventListener("keyup", handleConfirmByKey);
  }
  
  loadEvents();
  