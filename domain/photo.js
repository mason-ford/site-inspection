var pool = require('../database/mysql');

class Photo {
    static addPhoto(filename, inspectionCheckpointId, siteId) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    // Check if connection exists before releasing
                    if (connection) connection.release(); // Ensure connection is released
                    return reject(err);
                }

                const sql = 'INSERT INTO photo (filename, inspection_checkpoint_id, site_id) VALUES (?, ?, ?)';

                connection.query(sql, [filename, inspectionCheckpointId, siteId], (err, result) => {
                    connection.release(); // Release connection after query execution

                    if (err) {
                        return reject(err);
                    }

                    resolve(result.insertId); // Resolve with the ID of the newly inserted photo
                });
            });
        });
    }
}

module.exports = Photo;