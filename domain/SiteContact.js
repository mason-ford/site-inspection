var pool = require('../database/mysql');

class SiteContact {
    constructor(id, siteId, name, number, email, info) {
        this.id = id,
        this.siteId = siteId;
        this.name = name;
        this.number = number;
        this.email = email;
        this.info = info;
    }

    // Method to get all contacts for a site
    static getAllContactsForSite(siteId) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    connection.release(); // Ensure connection is released
                    return reject(err);
                }

                const sql = 'SELECT * FROM site_contact WHERE site_id = ?';
                
                connection.query(sql, [siteId], (err, results) => {
                connection.release(); // Release connection after query execution
                
                if (err) {
                    return reject(err);
                }

                const contacts = results.map(contactData => new SiteContact(contactData.id, contactData.site_id, contactData.name, contactData.number, contactData.email, contactData.info));
                resolve(contacts);
                });
            });
        });
    }
  
    // Method to add a contact for a site
    static addContact(siteId, name, number, email, info) {
      return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
          if (err) {
            connection.release(); // Ensure connection is released
            return reject(err);
          }
          
          const sql = 'INSERT INTO site_contact (site_id, name, number, email, info) VALUES (?, ?, ?, ?, ?)';
          const values = [siteId, name, number, email, info];
          
          connection.query(sql, values, (err, result) => {
            connection.release(); // Release connection after query execution
            
            if (err) {
              return reject(err);
            }
            
            const newContactId = result.insertId;
            console.log('Contact added successfully with ID:', newContactId);
            resolve(newContactId);
          });
        });
      });
    }
  
    // Method to update a contact for a site
    static updateContact(contactId, newName, newNumber, newEmail, newInfo) {
      return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
          if (err) {
            connection.release(); // Ensure connection is released
            return reject(err);
          }
          
          const sql = 'UPDATE site_contact SET name = ?, number = ?, email = ?, info = ? WHERE id = ?';
          const values = [newName, newNumber, newEmail, newInfo, contactId];
          
          connection.query(sql, values, (err, result) => {
            connection.release(); // Release connection after query execution
            
            if (err) {
              return reject(err);
            }
            
            // Check if any rows were affected
            if (result.affectedRows > 0) {
              resolve();
            } else {
              reject(new Error('Contact not found or no changes made.'));
            }
          });
        });
      });
    }
  
    // Method to delete a contact for a site
    static deleteContact(contactId) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
            if (err) {
                connection.release(); // Ensure connection is released
                return reject(err);
            }
            
            const sql = 'DELETE FROM site_contact WHERE id = ?';
            
            connection.query(sql, [contactId], (err, result) => {
                connection.release(); // Release connection after query execution
                
                if (err) {
                return reject(err);
                }
                
                // Check if any rows were affected
                if (result.affectedRows > 0) {
                resolve();
                } else {
                reject(new Error('Contact not found.'));
                }
            });
            });
        });
    }

}

module.exports = SiteContact;