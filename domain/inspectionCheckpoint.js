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
                        ic.*,
                        c.*,
                        p.filename AS photo_filename
                    FROM 
                        inspection_checkpoint ic
                    JOIN 
                        checkpoint c ON ic.checkpoint_id = c.id
                    LEFT JOIN 
                        photo p ON ic.id = p.inspection_checkpoint_id
                    WHERE 
                        ic.inspection_id = ?`;

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

    // Method to return all failed checkpoints from the most recent inspection for all sites
    static getFailedInspectionCheckpointsForSites() {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    // Check if connection exists before releasing
                    if (connection) connection.release(); // Ensure connection is released
                    return reject(err);
                }

                const sql = `
                    SELECT s.id AS site_id, s.name AS site_name, s.acronym AS site_acronym, s.number AS site_number, c.name AS checkpoint_name, ic.*, i.date_time AS inspection_date
                    FROM inspection_checkpoint ic
                    JOIN (
                        SELECT i.id AS inspection_id, i.site_id
                        FROM inspection i
                        JOIN (
                            SELECT MAX(date_time_edit) AS max_edit_date, site_id
                            FROM inspection
                            GROUP BY site_id
                        ) recent_edit_inspection ON i.site_id = recent_edit_inspection.site_id
                        WHERE i.date_time_edit = recent_edit_inspection.max_edit_date
                    ) recent_inspection_id ON ic.inspection_id = recent_inspection_id.inspection_id
                    JOIN site s ON recent_inspection_id.site_id = s.id
                    JOIN checkpoint c ON ic.checkpoint_id = c.id
                    JOIN inspection i ON ic.inspection_id = i.id
                    WHERE ic.result = 1
                    ORDER BY i.date_time ASC`;

                connection.query(sql, (err, results) => {
                    connection.release(); // Release connection after query execution

                    if (err) {
                        return reject(err);
                    }

                    const failedInspectionCheckpoints = results.map(result => {
                        return {
                            id: result.id,
                            inspectionId: result.inspection_id,
                            inspectionDate: result.inspection_date,
                            siteId: result.site_id,
                            siteName: result.site_name,
                            siteAcronym: result.site_acronym,
                            siteNumber: result.site_number,
                            checkpointId: result.checkpoint_id,
                            checkpointName: result.checkpoint_name,
                            result: result.result,
                            note: result.note
                        };
                    });
                    resolve(failedInspectionCheckpoints);
                });
            });
        });
    }

}

module.exports = InspectionCheckpoint;