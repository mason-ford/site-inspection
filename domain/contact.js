var pool = require('../database/mysql');

class Contact {
    constructor(id, siteId, name, number, email, information) {
        this.id = id,
        this.siteId = siteId;
        this.name = name;
        this.number = number;
        this.email = email;
        this.information = information;
    }

    // Method to get contact
    static getContact(contactId) {
      return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
              connection.release(); // Ensure connection is released
              return reject(err);
            }

            const sql = 'SELECT * FROM site_contact WHERE id = ?';
            
            connection.query(sql, [contactId], (err, results) => {
              connection.release(); // Release connection after query execution
              
              if (err) {
                  return reject(err);
              }

              // If contact with given ID exists, resolve with the contact object
              if (results.length > 0) {
                const contactData = results[0];
                const contact = new Contact(contactData.id, contactData.site_id, contactData.name, contactData.number, contactData.email, contactData.information);
                resolve(contact);
              } else {
                resolve(null);
              }
            });
        });
      });
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

                const contacts = results.map(contactData => new Contact(contactData.id, contactData.site_id, contactData.name, contactData.number, contactData.email, contactData.information));
                resolve(contacts);
                });
            });
        });
    }
  
    // Method to add a contact for a site
    static addContact(siteId, name, number, email, information) {
      return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
          if (err) {
            connection.release(); // Ensure connection is released
            return reject(err);
          }
          
          const sql = 'INSERT INTO site_contact (site_id, name, number, email, information) VALUES (?, ?, ?, ?, ?)';
          const values = [siteId, name, number, email, information];
          
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
    static updateContact(contactId, newName, newNumber, newEmail, newInformation) {
      return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
          if (err) {
            connection.release(); // Ensure connection is released
            return reject(err);
          }
          
          const sql = 'UPDATE site_contact SET name = ?, number = ?, email = ?, information = ? WHERE id = ?';
          const values = [newName, newNumber, newEmail, newInformation, contactId];
          
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

module.exports = Contact;