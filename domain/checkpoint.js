var pool = require('../database/mysql');

class Checkpoint {

    constructor(id, name, information, passText, failText) {
        this.id = id;
        this.name = name;
        this.information = information;
        this.passText = passText;
        this.failText = failText;
    }

    // Method to get a checkpoint by ID
    static getCheckpointById(checkpointId) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    connection.release(); // Ensure connection is released
                    return reject(err);
                }

                const sql = 'SELECT * FROM checkpoint WHERE id = ?';

                connection.query(sql, [checkpointId], (err, results) => {
                    connection.release(); // Release connection after query execution

                    if (err) {
                        return reject(err);
                    }

                    if (results.length === 0) {
                        return resolve(null); // Return null if checkpoint with given ID is not found
                    }

                    const checkpointData = results[0];
                    const checkpoint = new Checkpoint(checkpointData.id, checkpointData.name, checkpointData.information, checkpointData.pass_text, checkpointData.fail_text);
                    resolve(checkpoint);
                });
            });
        });
    }

    // Method to get all checkpoints
    static getAllCheckpoints() {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    connection.release(); // Ensure connection is released
                    return reject(err);
                }

                const sql = 'SELECT * FROM checkpoint';

                connection.query(sql, (err, results) => {
                    connection.release(); // Release connection after query execution

                    if (err) {
                        return reject(err);
                    }
                    console.log(results);
                    const checkpoints = results.map(checkpointData => new Checkpoint(checkpointData.id, checkpointData.name, checkpointData.information, checkpointData.pass_text, checkpointData.fail_text));
                    resolve(checkpoints);
                });
            });
        });
    }

    // Method to add a checkpoint
    static addCheckpoint(name, information, passText, failText) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    connection.release(); // Ensure connection is released
                    return reject(err);
                }

                const sql = 'INSERT INTO checkpoint (name, information, pass_text, fail_text) VALUES (?, ?, ?, ?)';
                const values = [name, information, passText, failText];

                connection.query(sql, values, (err, result) => {
                    connection.release(); // Release connection after query execution

                    if (err) {
                        console.log(err)
                        return reject(err);
                    }

                    const newCheckpointId = result.insertId;
                    console.log('Checkpoint added successfully with ID:', newCheckpointId);
                    resolve(newCheckpointId);
                });
            });
        });
    }

    // Method to update a checkpoint
    static updateCheckpoint(checkpointId, newName, newInformation, newPassText, newFailText) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    connection.release(); // Ensure connection is released
                    return reject(err);
                }

                const sql = 'UPDATE checkpoint SET name = ?, information = ?, pass_text = ?, fail_text = ? WHERE id = ?';
                const values = [newName, newInformation, newPassText, newFailText, checkpointId];

                connection.query(sql, values, (err, result) => {
                    connection.release(); // Release connection after query execution

                    if (err) {
                        return reject(err);
                    }

                    // Check if any rows were affected
                    if (result.affectedRows > 0) {
                        resolve();
                    } else {
                        reject(new Error('Checkpoint not found or no changes made.'));
                    }
                });
            });
        });
    }

    // Method to delete a checkpoint
    static deleteCheckpoint(checkpointId) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    connection.release(); // Ensure connection is released
                    return reject(err);
                }

                const sql = 'DELETE FROM checkpoint WHERE id = ?';

                connection.query(sql, [checkpointId], (err, result) => {
                    connection.release(); // Release connection after query execution

                    if (err) {
                        return reject(err);
                    }

                    // Check if any rows were affected
                    if (result.affectedRows > 0) {
                        resolve();
                    } else {
                        reject(new Error('Checkpoint not found.'));
                    }
                });
            });
        });
    }
}

module.exports = Checkpoint;