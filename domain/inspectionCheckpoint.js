var pool = require('../database/mysql');

class InspectionCheckpoint {

    constructor(id, inspectionId, checkpointId, result, note, name, information, passText, failText, actionText) {
        this.id = id;
        this.inspectionId = inspectionId;
        this.checkpointId = checkpointId;
        this.result = result;
        this.note = note;
        this.name = name;
        this.information = information;
        this.passText = passText;
        this.failText = failText;
        this.actionText = actionText;
    }

    // Method to get all inspection checkpoints for an inspection
    static getAllInspectionCheckpointsForInspection(inspectionId) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    // Check if connection exists before releasing
                    if (connection) connection.release(); // Ensure connection is released
                    return reject(err);
                }

                const sql = `
                    SELECT 
                        inspection_checkpoint.*,
                        checkpoint.*
                    FROM inspection_checkpoint 
                    JOIN checkpoint ON inspection_checkpoint.checkpoint_id = checkpoint.id
                    WHERE inspection_checkpoint.inspection_id = ?`;

                connection.query(sql, [inspectionId], (err, results) => {
                    connection.release(); // Release connection after query execution

                    if (err) {
                        return reject(err);
                    }

                    const inspectionCheckpoints = results.map(icData => new InspectionCheckpoint(icData.id, icData.inspection_id, icData.checkpoint_id, icData.result, icData.note, icData.name, icData.information, icData.pass_text, icData.fail_text, icData.action_text));
                    resolve(inspectionCheckpoints);
                });
            });
        });
    }

}

module.exports = InspectionCheckpoint;