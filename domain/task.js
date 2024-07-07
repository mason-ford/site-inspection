var pool = require('../database/mysql');

class Task {
  constructor(id, name, information, siteId, dateCreated, dateCompleted, createdByUserId, completedByUserId, completed, completeInformation) {
    this.id = id;
    this.name = name;
    this.information = information;
    this.siteId = siteId;
    this.dateCreated = dateCreated;
    this.dateCompleted = dateCompleted;
    this.createdByUserId = createdByUserId;
    this.completedByUserId = completedByUserId;
    this.completed = completed;
    this.completeInformation = completeInformation;
  }

  // Method to add a new task
  static addTask(name, information, siteId, createdByUserId) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          if (connection) {
            connection.release();
          }
          return reject(err);
        }

        const dateCreated = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const sql = 'INSERT INTO task (name, information, site_id, date_created, created_by_user_id) VALUES (?, ?, ?, ?, ?)';
        const values = [name, information, siteId, dateCreated, createdByUserId];

        connection.query(sql, values, (err, result) => {
          connection.release();

          if (err) {
            return reject(err);
          }

          resolve(result.insertId);
        });
      });
    });
  }

  // Method to delete a task
  static deleteTask(taskId) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          if (connection) {
            connection.release();
          }
          return reject(err);
        }

        const sql = 'DELETE FROM task WHERE id = ?';
        connection.query(sql, [taskId], (err, result) => {
          connection.release();

          if (err) {
            return reject(err);
          }

          resolve(result.affectedRows > 0);
        });
      });
    });
  }

  static getTaskById(taskId) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          connection.release(); // Ensure connection is released
          return reject(err);
        }

        const sql = `
          SELECT task.*, site.name AS siteName
          FROM task
          JOIN site ON task.site_id = site.id
          WHERE task.id = ?
        `;
        connection.query(sql, [taskId], (err, rows) => {
          connection.release(); // Ensure connection is released
          if (err) {
            return reject(err);
          }
          if (rows.length === 1) {
            resolve(rows[0]); // Resolve with the task if found
          } else {
            resolve(null); // Resolve with null if task not found
          }
        });
      });
    });
  }

  // Method to get all tasks with site information
  static getAllTasks() {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          if (connection) {
            connection.release();
          }
          return reject(err);
        }

        const sql = `
          SELECT task.*, site.id AS site_id, site.number AS site_number, site.acronym AS site_acronym, site.name AS site_name
          FROM task
          INNER JOIN site ON task.site_id = site.id
          ORDER BY task.date_created DESC
        `;

        connection.query(sql, (err, results) => {
          connection.release();

          if (err) {
            return reject(err);
          }

          const tasks = results.map(taskData => ({
            id: taskData.id,
            name: taskData.name,
            information: taskData.information,
            siteId: taskData.site_id,
            dateCreated: taskData.date_created,
            dateCompleted: taskData.date_completed,
            createdByUserId: taskData.created_by_user_id,
            completedByUserId: taskData.completed_by_user_id,
            completed: taskData.completed,
            completeInformation: taskData.completeInformation,
            site: {
              id: taskData.site_id,
              number: taskData.site_number,
              acronym: taskData.site_acronym,
              name: taskData.site_name
            }
          }));

          resolve(tasks);
        });
      });
    });
  }

  // Method to get all tasks for a specific site
  static getAllTasksForSite(siteId) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          if (connection) {
            connection.release();
          }
          return reject(err);
        }

        const sql = 'SELECT * FROM task WHERE site_id = ?';
        connection.query(sql, [siteId], (err, results) => {
          connection.release();

          if (err) {
            return reject(err);
          }

          const tasks = results.map(taskData => {
            return new Task(taskData.id, taskData.name, taskData.information, taskData.site_id, taskData.date_created, taskData.date_completed, taskData.created_by_user_id, taskData.completed_by_user_id, taskData.completed, taskData.completeInformation);
          });
          resolve(tasks);
        });
      });
    });
  }

  static completeTask(taskId, completeInformation) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          connection.release(); // Ensure connection is released
          return reject(err);
        }
  
        const dateCompleted = new Date().toISOString().slice(0, 19).replace('T', ' '); // Current timestamp
        const sql = "UPDATE task SET completed = true, completeInformation = ?, date_completed = ? WHERE id = ?";
        const values = [completeInformation, dateCompleted, taskId];
  
        connection.query(sql, values, (err, result) => {
          connection.release(); // Ensure connection is released
          if (err) {
            return reject(err);
          }
          resolve(result.affectedRows > 0); // Resolve with true if the task was successfully completed
        });
      });
    });
  }

  // Method to get all uncompleted tasks
  static getAllUncompletedTasks() {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          if (connection) {
            connection.release();
          }
          return reject(err);
        }

        const sql = `
          SELECT task.*, site.id AS site_id, site.number AS site_number, site.acronym AS site_acronym, site.name AS site_name
          FROM task
          INNER JOIN site ON task.site_id = site.id
          WHERE task.completed = false
        `;

        connection.query(sql, (err, results) => {
          connection.release();

          if (err) {
            return reject(err);
          }

          const tasks = results.map(taskData => ({
            id: taskData.id,
            name: taskData.name,
            information: taskData.information,
            siteId: taskData.site_id,
            dateCreated: taskData.date_created,
            dateCompleted: taskData.date_completed,
            createdByUserId: taskData.created_by_user_id,
            completedByUserId: taskData.completed_by_user_id,
            completed: taskData.completed,
            completeInformation: taskData.completeInformation,
            site: {
              id: taskData.site_id,
              number: taskData.site_number,
              acronym: taskData.site_acronym,
              name: taskData.site_name
            }
          }));
          
          resolve(tasks);
        });
      });
    });
  }

  // Method to get all uncompleted tasks for a site
  static getUncompletedTasksForSite(siteId) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          if (connection) {
            connection.release();
          }
          return reject(err);
        }

        const sql = 'SELECT * FROM task WHERE site_id = ? AND completed = false';
        connection.query(sql, [siteId], (err, results) => {
          connection.release();

          if (err) {
            return reject(err);
          }

          const tasks = results.map(taskData => {
            return new Task(taskData.id, taskData.name, taskData.information, taskData.site_id, taskData.date_created, taskData.date_completed, taskData.created_by_user_id, taskData.completed_by_user_id, taskData.completed, taskData.completeInformation);
          });
          resolve(tasks);
        });
      });
    });
  }

  static getTasksWithinDateRange(startDate, endDate) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          if (connection) {
            connection.release();
          }
          return reject(err);
        }

        const sql = `
          SELECT task.*, site.id AS site_id, site.number AS site_number, site.acronym AS site_acronym, site.name AS site_name
          FROM task
          INNER JOIN site ON task.site_id = site.id
          WHERE task.date_created BETWEEN ? AND ?
        `;
        connection.query(sql, [startDate, endDate], (err, results) => {
          connection.release();

          if (err) {
            return reject(err);
          }

          const tasks = results.map(taskData => ({
            id: taskData.id,
            name: taskData.name,
            information: taskData.information,
            siteId: taskData.site_id,
            dateCreated: taskData.date_created,
            dateCompleted: taskData.date_completed,
            createdByUserId: taskData.created_by_user_id,
            completedByUserId: taskData.completed_by_user_id,
            completed: taskData.completed,
            completeInformation: taskData.completeInformation,
            site: {
              id: taskData.site_id,
              number: taskData.site_number,
              acronym: taskData.site_acronym,
              name: taskData.site_name
            }
          }));

          resolve(tasks);
        });
      });
    });
  }

  static countTasks(startDate, endDate) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          if (connection) connection.release();
          return reject(err);
        }

        const sql = `
          SELECT 
            COUNT(CASE WHEN date_created BETWEEN ? AND ? THEN 1 END) AS totalTasks,
            COUNT(CASE WHEN date_completed BETWEEN ? AND ? THEN 1 END) AS completedTasks
          FROM task
        `;

        connection.query(sql, [startDate, endDate, startDate, endDate], (err, results) => {
          connection.release();

          if (err) {
            return reject(err);
          }

          const taskCount = {
            totalTasks: results[0].totalTasks,
            completedTasks: results[0].completedTasks
          };

          resolve(taskCount);
        });
      });
    });
  }
  
}

module.exports = Task;
