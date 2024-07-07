const express = require('express');
const router = express.Router();
var moment = require('moment');
const Task = require('../domain/task');
const Site = require('../domain/site');

const menuId = 'task';

// Route to get all tasks
router.get('/', (req, res) => {
    Task.getAllTasks()
        .then(tasks => {
            res.render('tasks/tasksView', { page: 'Tasks', menuId: menuId, moment: moment, tasks: tasks });
        })
        .catch(err => {
            console.error('Error:', err);
            res.status(500).send('Internal Server Error');
        });
});

// Route to render the add task page
router.get('/add', (req, res) => {
    Site.getAllSites()
        .then(sites => {
            res.render('tasks/taskAddView', { page: 'Tasks', menuId: menuId, sites: sites });
        })
        .catch(err => {
            console.error('Error:', err);
            res.status(500).send('Internal Server Error');
        });
});


// Route to handle adding a new task
router.post('/add', (req, res) => {
    const { name, information, siteId, createdByUserId } = req.body;

    Task.addTask(name, information, siteId, createdByUserId)
        .then(taskId => {
            res.redirect('/tasks');
        })
        .catch(err => {
            console.error('Error:', err);
            res.status(500).send('Internal Server Error');
        });
});

// Route to render the edit task page
router.get('/edit/:id', (req, res) => {
    const taskId = req.params.id;

    Task.getTaskById(taskId)
        .then(task => {
            if (!task) {
                return res.status(404).send('Task not found');
            }
            res.render('tasks/taskEditView', { page: 'Tasks', menuId: menuId, task: task });
        })
        .catch(err => {
            console.error('Error:', err);
            res.status(500).send('Internal Server Error');
        });
});

// Route to handle updating a task
router.post('/edit/:id', (req, res) => {
    const taskId = req.params.id;
    const { name, information, siteId, completed, completeInformation } = req.body;

    Task.getTaskById(taskId)
        .then(task => {
            if (!task) {
                return res.status(404).send('Task not found');
            }
            // Update task properties
            task.name = name;
            task.information = information;
            task.siteId = siteId;
            task.completed = completed;
            task.completeInformation = completeInformation;

            // Perform update operation
            // Assuming you have a method like task.update() to update the task in the database
            // Implement it as per your Task class
            return task.update();
        })
        .then(() => {
            res.redirect('/tasks');
        })
        .catch(err => {
            console.error('Error:', err);
            res.status(500).send('Internal Server Error');
        });
});

// Route to handle deleting a task
router.post('/delete/:id', (req, res) => {
    const taskId = req.params.id;

    Task.deleteTask(taskId)
        .then(success => {
            if (!success) {
                return res.status(404).send('Task not found');
            }
            res.redirect('/tasks');
        })
        .catch(err => {
            console.error('Error:', err);
            res.status(500).send('Internal Server Error');
        });
});

// Route to render the complete task page
router.get('/complete/:taskId', (req, res) => {
    const taskId = req.params.taskId;
    Task.getTaskById(taskId)
        .then(task => {
            res.render('tasks/taskCompleteView', { page: 'Tasks', menuId: menuId, task: task });
        })
        .catch(err => {
            console.error('Error:', err);
            res.status(500).send('Internal Server Error');
        });
});

// Route to handle completing a task
router.post('/complete/:taskId', (req, res) => {
    const taskId = req.params.taskId;
    const completeInformation = req.body.completeInformation;

    Task.completeTask(taskId, completeInformation)
        .then(completed => {
            if (completed) {
                // Task was successfully completed
                res.redirect('/tasks');
            } else {
                // Task could not be completed (maybe task not found)
                res.status(404).send('Task not found');
            }
        })
        .catch(err => {
            console.error('Error:', err);
            res.status(500).send('Internal Server Error');
        });
});

// Route to render the single task page
router.get('/:taskId', (req, res) => {
    const taskId = req.params.taskId;

    Task.getTaskById(taskId)
        .then(task => {
            if (task) {
                res.render('tasks/taskView', { page: 'Tasks', menuId: menuId, moment: moment, task: task });
            } else {
                res.status(404).send('Task not found');
            }
        })
        .catch(err => {
            console.error('Error:', err);
            res.status(500).send('Internal Server Error');
        });
});

module.exports = router;
