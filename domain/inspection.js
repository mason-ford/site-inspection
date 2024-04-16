const { check } = require('express-validator');
var pool = require('../database/mysql');

class Inspection {

  constructor(id, siteId, dateTime, dateTimeEdit, information, userName, userId) {
    this.id = id;
    this.siteId = siteId;
    this.dateTime = dateTime;
    this.dateTimeEdit = dateTimeEdit;
    this.information = information
    this.userName = userName;
    this.userId = userId;
  }

  // Method to add an inspection
  static addInspection(siteId, dateTime, information, userName, userId, checkpoints) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          // Check if connection exists before releasing
          if (connection) connection.release(); // Ensure connection is released
          return reject(err);
        }

        connection.beginTransaction(transactionErr => {
          if (transactionErr) {
            connection.release(); // Ensure connection is released
            return reject(transactionErr);
          }

          const inspectionSql = 'INSERT INTO inspection (site_id, date_time, information, user_name, user_id) VALUES (?, ?, ?, ?, ?)';
          const inspectionValues = [siteId, dateTime, information, userName, userId];

          connection.query(inspectionSql, inspectionValues, (inspectionErr, inspectionResult) => {
            if (inspectionErr) {
              return connection.rollback(() => {
                connection.release(); // Ensure connection is released
                reject(inspectionErr);
              });
            }

            const inspectionId = inspectionResult.insertId;

            // Prepare data for insertion into inspection_checkpoints table
            const inspectionCheckpointValues = checkpoints.map(checkpoint => [inspectionId, checkpoint.id, checkpoint.result, checkpoint.note]);
            const inspectionCheckpointSql = 'INSERT INTO inspection_checkpoint (inspection_id, checkpoint_id, result, note) VALUES ?';

            connection.query(inspectionCheckpointSql, [inspectionCheckpointValues], (inspectionCheckpointErr, inspectionCheckpointResult) => {
              if (inspectionCheckpointErr) {
                return connection.rollback(() => {
                  connection.release(); // Ensure connection is released
                  reject(inspectionCheckpointErr);
                });
              }

              connection.commit(commitErr => {
                if (commitErr) {
                  return connection.rollback(() => {
                    connection.release(); // Ensure connection is released
                    reject(commitErr);
                  });
                }

                connection.release(); // Release connection after successful transaction
                resolve(inspectionId);
              });
            });
          });
        });
      });
    });
  }

  // Method to get an inspection by ID
  static getInspectionById(inspectionId) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          // Check if connection exists before releasing
          if (connection) connection.release(); // Ensure connection is released
          return reject(err);
        }

        const sql = 'SELECT * FROM inspection WHERE id = ?';

        connection.query(sql, [inspectionId], (err, results) => {
          connection.release(); // Release connection after query execution

          if (err) {
            return reject(err);
          }

          if (results.length === 0) {
            return resolve(null); // Return null if inspection with given ID is not found
          }

          const inspectionData = results[0];
          const inspection = new Inspection(inspectionData.id, inspectionData.site_id, inspectionData.date_time, inspectionData.date_time_edit, inspectionData.information, inspectionData.user_name, inspectionData.user_id);
          resolve(inspection);
        });
      });
    });
  }

  // Method to get all inspections for site
  static getAllInspectionsForSite(siteId) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          // Check if connection exists before releasing
          if (connection) connection.release(); // Ensure connection is released
          return reject(err);
        }

        const sql = 'SELECT * FROM inspection WHERE site_id = ? ORDER BY date_time DESC';

        connection.query(sql, [siteId], (err, results) => {
          connection.release(); // Release connection after query execution

          if (err) {
            console.error(err);
            return reject(err);
          }

          const inspections = results.map(inspectionData => {
            return new Inspection(
              inspectionData.id,
              inspectionData.site_id,
              inspectionData.date_time,
              inspectionData.date_time_edit,
              inspectionData.information,
              inspectionData.user_name,
              inspectionData.user_id
            );
          });
          resolve(inspections);
        });
      });
    });
  }

  // Method to get all inspections with associated site information
  static getLatestInspections(amount) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          // Check if connection exists before releasing
          if (connection) connection.release(); // Ensure connection is released
          return reject(err);
        }

        const sql = `
          SELECT 
            inspection.*, 
            site.name AS siteName,
            site.acronym AS siteAcronym, 
            site.number AS siteNumber
          FROM inspection 
          JOIN site ON inspection.site_id = site.id
          ORDER BY inspection.date_time DESC
          LIMIT ?`;

        connection.query(sql, [amount], (err, results) => {
          connection.release(); // Release connection after query execution

          if (err) {
            return reject(err);
          }

          const inspections = results.map(inspectionData => {
            return {
              id: inspectionData.id,
              siteId: inspectionData.site_id,
              siteName: inspectionData.siteName,
              siteAcronym: inspectionData.siteAcronym,
              siteNumber: inspectionData.siteNumber,
              dateTime: inspectionData.date_time,
              information: inspectionData.information,
              userName: inspectionData.user_name,
              userId: inspectionData.user_id
            };
          });
          resolve(inspections);
        });
      });
    });
  }

  // Method to get all inspections with associated site information
  static getAllInspections() {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          // Check if connection exists before releasing
          if (connection) connection.release(); // Ensure connection is released
          return reject(err);
        }

        const sql = `
          SELECT 
            inspection.*, 
            site.name AS siteName,
            site.acronym AS siteAcronym, 
            site.number AS siteNumber
          FROM inspection 
          JOIN site ON inspection.site_id = site.id
          ORDER BY inspection.date_time DESC`;

        connection.query(sql, (err, results) => {
          connection.release(); // Release connection after query execution

          if (err) {
            return reject(err);
          }

          const inspections = results.map(inspectionData => {
            return {
              id: inspectionData.id,
              siteId: inspectionData.site_id,
              siteName: inspectionData.siteName,
              siteAcronym: inspectionData.siteAcronym,
              siteNumber: inspectionData.siteNumber,
              dateTime: inspectionData.date_time,
              information: inspectionData.information,
              userName: inspectionData.user_name,
              userId: inspectionData.user_id
            };
          });
          resolve(inspections);
        });
      });
    });
  }

  // Method to update an inspection and associated checkpoints
  static updateInspection(inspectionId, information, checkpoints) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          // Check if connection exists before releasing
          if (connection) connection.release(); // Ensure connection is released
          return reject(err);
        }

        connection.beginTransaction(transactionErr => {
          if (transactionErr) {
            connection.release(); // Ensure connection is released
            return reject(transactionErr);
          }

          const inspectionSql = 'UPDATE inspection SET information = ? WHERE id = ?';
          const inspectionValues = [information, inspectionId];

          connection.query(inspectionSql, inspectionValues, (inspectionErr, inspectionResult) => {
            if (inspectionErr) {
              return connection.rollback(() => {
                connection.release(); // Ensure connection is released
                reject(inspectionErr);
              });
            }

            // Delete existing inspection checkpoints
            const deleteSql = 'DELETE FROM inspection_checkpoint WHERE inspection_id = ?';
            connection.query(deleteSql, [inspectionId], (deleteErr, deleteResult) => {
              if (deleteErr) {
                return connection.rollback(() => {
                  connection.release(); // Ensure connection is released
                  reject(deleteErr);
                });
              }

              // Insert updated inspection checkpoints
              const inspectionCheckpointValues = checkpoints.map(checkpoint => [inspectionId, checkpoint.id, checkpoint.result, checkpoint.note]);
              const inspectionCheckpointSql = 'INSERT INTO inspection_checkpoint (inspection_id, checkpoint_id, result, note) VALUES ?';

              connection.query(inspectionCheckpointSql, [inspectionCheckpointValues], (inspectionCheckpointErr, inspectionCheckpointResult) => {
                if (inspectionCheckpointErr) {
                  return connection.rollback(() => {
                    connection.release(); // Ensure connection is released
                    reject(inspectionCheckpointErr);
                  });
                }

                connection.commit(commitErr => {
                  if (commitErr) {
                    return connection.rollback(() => {
                      connection.release(); // Ensure connection is released
                      reject(commitErr);
                    });
                  }

                  connection.release(); // Release connection after successful transaction
                  resolve();
                });
              });
            });
          });
        });
      });
    });
  }

  // Method to delete an inspection
  static deleteInspection(inspectionId) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          // Check if connection exists before releasing
          if (connection) connection.release(); // Ensure connection is released
          return reject(err);
        }

        const sql = 'DELETE FROM inspection WHERE id = ?';

        connection.query(sql, [inspectionId], (err, result) => {
          connection.release(); // Release connection after query execution

          if (err) {
            return reject(err);
          }

          // Check if any rows were affected
          if (result.affectedRows > 0) {
            resolve();
          } else {
            reject(new Error('Inspection not found.'));
          }
        });
      });
    });
  }

}

module.exports = Inspection;