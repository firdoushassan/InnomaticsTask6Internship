let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const addTask = () => {
    const taskInput = document.getElementById('taskInput');
    const dueDate = document.getElementById('dueDate');
    const taskCategory = document.getElementById('taskCategory');
    const taskPriority = document.getElementById('taskPriority');

    if (taskInput.value === '') {
        alert('Please enter a task.');
        return;
    }

    const task = {
        id: Date.now(),
        name: taskInput.value,
        dueDate: dueDate.value,
        category: taskCategory.value,
        priority: taskPriority.value,
        completed: false,
    };

    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    taskInput.value = '';
    dueDate.value = '';
    taskCategory.value = '';
    taskPriority.value = '';
    renderTasks();
};

const getPriorityClass = (priority) => {
    switch (priority) {
        case 'High': return 'bg-danger'; // Red for high priority
        case 'Medium': return 'bg-warning'; // Yellow for medium priority
        case 'Low': return 'bg-primary'; // Blue for low priority
        default: return 'bg-secondary'; // Default
    }
};

const renderTasks = (filter = 'all') => {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    let filteredTasks = tasks;

    if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    } else if (filter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `list-group-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <input type="checkbox" onchange="toggleTask(${task.id})" ${task.completed ? 'checked' : ''}>
            <strong>${task.name}</strong> - Due: ${task.dueDate || 'No due date'} 
            <span class="badge ${getPriorityClass(task.priority)}">${task.priority}</span>
            <span class="badge bg-info">${task.category}</span>
            <button class="btn btn-danger btn-sm float-end" onclick="deleteTask(${task.id})">
                <i class="bi bi-trash"></i>
            </button>
            <button class="btn btn-secondary btn-sm float-end me-2" onclick="editTask(${task.id})">
                <i class="bi bi-pencil"></i>
            </button>
        `;
        taskList.appendChild(li);
    });
};

const toggleTask = (id) => {
    const task = tasks.find(task => task.id === id);
    task.completed = !task.completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
};

const deleteTask = (id) => {
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
};

const editTask = (id) => {
    const task = tasks.find(task => task.id === id);
    const taskInput = document.getElementById('taskInput');
    const dueDate = document.getElementById('dueDate');
    const taskCategory = document.getElementById('taskCategory');
    const taskPriority = document.getElementById('taskPriority');

    taskInput.value = task.name;
    dueDate.value = task.dueDate;
    taskCategory.value = task.category;
    taskPriority.value = task.priority;

    deleteTask(id); // Remove the task to avoid duplicates on saving
};

const filterTasks = (status) => {
    renderTasks(status);
};

// Initial rendering of tasks
renderTasks();
document.getElementById('addTaskBtn').addEventListener('click', addTask);
