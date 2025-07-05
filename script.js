document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const dueTimeInput = document.getElementById('dueTimeInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');

    let tasks = [];
    let editingTaskId = null;

    const renderTasks = () => {
        taskList.innerHTML = '';
        if (tasks.length === 0) {
            const noTaskMessage = document.createElement('p');
            noTaskMessage.textContent = 'No tasks yet! Add some above.';
            noTaskMessage.style.cssText = 'text-align: center; color: #777; font-size: 1.1em; margin-top: 20px;';
            taskList.appendChild(noTaskMessage);
            return;
        }

        tasks.forEach(task => {
            const listItem = document.createElement('li');
            listItem.className = `task-item ${task.completed ? 'completed' : ''}`;

            if (editingTaskId === task.id) {
                // Editing mode
                listItem.innerHTML = `
                    <div class="editing-inputs">
                        <input type="text" class="edit-task-text" value="${task.text}">
                        <input type="date" class="edit-due-date" value="${task.dueDate}">
                        <input type="time" class="edit-due-time" value="${task.dueTime}">
                    </div>
                    <div class="editing-actions">
                        <button class="save-button">Save</button>
                        <button class="cancel-button">Cancel</button>
                    </div>
                `;

                const saveButton = listItem.querySelector('.save-button');
                const cancelButton = listItem.querySelector('.cancel-button');

                saveButton.addEventListener('click', () => {
                    const newText = listItem.querySelector('.edit-task-text').value.trim();
                    const newDueDate = listItem.querySelector('.edit-due-date').value;
                    const newDueTime = listItem.querySelector('.edit-due-time').value;
                    if (newText) {
                        task.text = newText;
                        task.dueDate = newDueDate;
                        task.dueTime = newDueTime;
                        editingTaskId = null;
                        renderTasks();
                    }
                });

                cancelButton.addEventListener('click', () => {
                    editingTaskId = null;
                    renderTasks();
                });

            } else {
                // Display mode
                listItem.innerHTML = `
                    <div class="task-content">
                        <label class="checkbox-label">
                            <input type="checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
                            <span class="checkmark"></span>
                        </label>
                        <span class="task-text">${task.text}</span>
                        ${(task.dueDate || task.dueTime) ? `<span class="task-meta">${task.dueDate ? `Due: ${task.dueDate}` : ''}${task.dueDate && task.dueTime ? ' at ' : ''}${task.dueTime ? `${task.dueTime}` : ''}</span>` : ''}
                    </div>
                    <div class="task-actions">
                        <button class="edit-button" data-id="${task.id}">Edit</button>
                        <button class="delete-button" data-id="${task.id}">Delete</button>
                    </div>
                `;

                const checkbox = listItem.querySelector('input[type="checkbox"]');
                checkbox.addEventListener('change', () => {
                    task.completed = checkbox.checked;
                    renderTasks();
                });

                const editButton = listItem.querySelector('.edit-button');
                editButton.addEventListener('click', () => {
                    editingTaskId = task.id;
                    renderTasks();
                });

                const deleteButton = listItem.querySelector('.delete-button');
                deleteButton.addEventListener('click', () => {
                    tasks = tasks.filter(t => t.id !== task.id);
                    renderTasks();
                });
            }
            taskList.appendChild(listItem);
        });
    };

    const addTask = () => {
        const text = taskInput.value.trim();
        const dueDate = dueDateInput.value;
        const dueTime = dueTimeInput.value;

        if (text) {
            const newTask = {
                id: Date.now(),
                text,
                completed: false,
                dueDate,
                dueTime
            };
            tasks.push(newTask);
            taskInput.value = '';
            dueDateInput.value = '';
            dueTimeInput.value = '';
            renderTasks();
        }
    };

    addTaskButton.addEventListener('click', addTask);

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    renderTasks();
});
