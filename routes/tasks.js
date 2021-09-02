var express = require('express');
var moment = require('moment');
var router = express.Router();
const Task = require('../domain/task');
const Site = require('../domain/site');

const menuId = 'task';

router.get('/', (req, res) => {
    console.log('Get all tasks');

    Task.getAllCompletedTasks().then(tasks => {
        res.render('tasks/tasks', {page: 'Tasks', menuId: menuId, tasks: tasks, moment: moment})
    });

});

router.get('/add', (req, res) => {
    console.log('Add task page');

    Site.getAllSites().then(sites => {
        res.render('tasks/tasks-add', {page: 'Add Task', menuId: menuId, sites: sites});
    });
});

router.post('/add', (req, res) => {
    console.log('Add task');

    let date = new Date(Date.now());
    let user = req.body.task_user;
    let siteId = req.body.task_site;
    let text = req.body.task_text;

    if(siteId === "all") {
        Site.getAllSites().then(sites => {
            sites.forEach(site => {
                let task = new Task(null, site._id, false, {date: date, user: user, text: text}, null);
                task.addTask();
            });
        });
    } else {
        let task = new Task(null, siteId, false, {date: date, user: user, text: text}, null);
        task.addTask().then(id => {
            res.redirect('/tasks/');
        });
    }

});

module.exports = router;