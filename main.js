const tasksList = document.querySelector('#tasks-list');
const newTaskInput = document.querySelector('#new-task-input');
const addTaskButton = document.querySelector('#add-task-button');
//guardar tareas
const tasks = [];
// crer objeto global para tener las referencias
const app = {
    tasks: tasks,
    tasksList: tasksList,
    newTaskInput: newTaskInput,
}

//Cargar tareas del local
window.onload = function() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    app.tasks = savedTasks.map((task) => {
        return createTask(task.title, task.isCompleted);
    })
    app.tasks.forEach((task) => {
        return addTaskToList(task, app.tasksList);
    });
}

//Guardar tareasen Local Storage
function saveTasksToLocalStorage (tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

//funcion para añadir tareas
function createTask(title, isCompleted = false) {
    return {
        id: Date.now(),
        title,
        isCompleted,
    };
}
//funcion añadir tarea a la lista
function addTaskToList(task, taskList){
    const taskElement = createTaskElement(task);
    taskList.appendChild(taskElement);
}

//funcion q se llame cuando se aplasta el botón
function addTask(app) {
    const newTaskTitle = app.newTaskInput.value;
    //console.log(newTaskTitle);
    const newTask = createTask(newTaskTitle);
    app.tasks.push(newTask);

    addTaskToList(newTask, app.tasksList);
    //mandar al storage
    saveTasksToLocalStorage(app.tasks);
    app.newTaskInput.value = '';
}

//funcion crear forma mostrar tarea en el html
function createTaskElement(task){
    const taskElement = document.createElement('li');
    const taskCheckbox = document.createElement('input');
    taskCheckbox.type = 'checkbox';
    taskCheckbox.checked = task.isCompleted;
    taskCheckbox.addEventListener('change', () => {
        task.isCompleted = taskCheckbox.checked;
        taskText.classList.toggle("completed", task.isCompleted)
        saveTasksToLocalStorage(app.tasks);
    });
    const taskText = document.createElement('span');
    taskText.textContent = task.title;
    taskText.classList.toggle("completed", task.isCompleted);

    const taskDeleteButton = document.createElement('button');
    taskDeleteButton.textContent = 'Eliminar';
    taskDeleteButton.className = 'delete-button';
    taskDeleteButton.addEventListener('click', () => {
        //Eliminar la tarea de la lista
        taskElement.remove();
        const taskIndex = app.tasks.indexOf(task);
        if (taskIndex > -1) {
            app.tasks.splice(taskIndex, 1);
        }
        saveTasksToLocalStorage(app.tasks);
    });
    taskElement.appendChild(taskCheckbox);
    taskElement.appendChild(taskText);
    taskElement.appendChild(taskDeleteButton);

    return taskElement;
}
addTaskButton.addEventListener('click', () => {
    addTask(app);
})

newTaskInput.addEventListener('keydown', (event) => {
    if(event.key === 'Enter'){
        addTask(app);
    }
})