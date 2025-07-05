// DOM Elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const taskTemplate = document.getElementById('taskTemplate');
const taskCount = document.getElementById('taskCount');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');

// Current filter
let currentFilter = 'all';

// Task array to store all tasks
let tasks = [];

// Load tasks from localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        renderTasks();
    }
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Generate unique ID for each task
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Add new task
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const newTask = {
        id: generateId(),
        text: taskText,
        completed: false,
        createdAt: Date.now()
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();

    // Clear input field
    taskInput.value = '';
    taskInput.focus();
}

// Delete task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

// Toggle task completion
function toggleTaskCompletion(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveTasks();
    renderTasks();
}

// Edit task
function editTask(id, newText) {
    if (newText.trim() === '') return;

    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, text: newText.trim() };
        }
        return task;
    });
    saveTasks();
    renderTasks();
}

// Start editing task
function startEditing(taskItem, taskId) {
    taskItem.classList.add('editing');
    const editInput = taskItem.querySelector('.edit-input');
    const taskTextElement = taskItem.querySelector('.task-text');

    // Set input value to current task text
    editInput.value = taskTextElement.textContent;
    // Focus and position cursor at the end
    editInput.focus();
    editInput.selectionStart = editInput.value.length;
}

// Stop editing task
function stopEditing(taskItem, taskId) {
    taskItem.classList.remove('editing');
    const editInput = taskItem.querySelector('.edit-input');
    editTask(taskId, editInput.value);
}

// Filter tasks
function filterTasks(filter) {
    currentFilter = filter;

    // Update active filter button
    filterBtns.forEach(btn => {
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    renderTasks();
}

// Clear completed tasks
function clearCompletedTasks() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
}

// Update task count display
function updateTaskCount() {
    const remainingTasks = tasks.filter(task => !task.completed).length;
    taskCount.textContent = `${remainingTasks} task${remainingTasks !== 1 ? 's' : ''} left`;
}

// Create a task element from template
function createTaskElement(task) {
    const taskClone = document.importNode(taskTemplate.content, true);
    const taskItem = taskClone.querySelector('.task-item');

    // Set task ID as data attribute
    taskItem.dataset.id = task.id;

    // Set task text
    const taskText = taskItem.querySelector('.task-text');
    taskText.textContent = task.text;

    // Set checkbox state
    const checkbox = taskItem.querySelector('.task-checkbox');
    checkbox.checked = task.completed;

    // Add completed class if task is completed
    if (task.completed) {
        taskItem.classList.add('completed');
    }

    // Event listeners
    checkbox.addEventListener('change', () => {
        toggleTaskCompletion(task.id);
    });

    const editBtn = taskItem.querySelector('.edit-btn');
    editBtn.addEventListener('click', () => {
        startEditing(taskItem, task.id);
    });

    const deleteBtn = taskItem.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        deleteTask(task.id);
    });

    const editInput = taskItem.querySelector('.edit-input');
    editInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            stopEditing(taskItem, task.id);
        } else if (e.key === 'Escape') {
            taskItem.classList.remove('editing');
        }
    });

    editInput.addEventListener('blur', () => {
        if (taskItem.classList.contains('editing')) {
            stopEditing(taskItem, task.id);
        }
    });

    return taskItem;
}

// Render all tasks
function renderTasks() {
    // Clear task list
    taskList.innerHTML = '';

    // Get filtered tasks
    let filteredTasks = [];
    switch (currentFilter) {
        case 'active':
            filteredTasks = tasks.filter(task => !task.completed);
            break;
        case 'completed':
            filteredTasks = tasks.filter(task => task.completed);
            break;
        default: // 'all'
            filteredTasks = [...tasks];
    }

    // Sort tasks by creation date (newest first)
    filteredTasks.sort((a, b) => b.createdAt - a.createdAt);

    // Add task elements to list
    filteredTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        taskList.appendChild(taskElement);
    });

    // Update task count
    updateTaskCount();
}

// Event Listeners
addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterTasks(btn.dataset.filter);
    });
});

clearCompletedBtn.addEventListener('click', clearCompletedTasks);

// Initialize app
loadTasks();
