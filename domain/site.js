var pool  = require('../database/mysql');

class Site {

  constructor(id,name,acronym,number,address,latlong,standardKey,keyInstructions,accessInstructions) {
    this.id = id;
    this.name = name;
    this.acronym = acronym;
    this.number = number;
    this.address = address;
    this.latlong = latlong;
    this.standardKey = standardKey;
    this.keyInstructions = keyInstructions;
    this.accessInstructions = accessInstructions;

    this.oldestInspection = null;
    this.newestInspection = null;
  }

  findLastTimeCheckpointsGood() {
    this.checkpoints.forEach(checkpoint => {
      checkpoint.lastTimeGood = { 
        inspectionId: null,
        date: 'Never'
      };
      var found = false;

      for (let i = 0; i < this.inspections.length; i++) {
        for (let j = 0; j < this.inspections[i].checkpoints.length; j++) {
          if(this.inspections[i].checkpoints[j]._id.equals(checkpoint._id)) {
            if(this.inspections[i].checkpoints[j].value === 1) {
              checkpoint.lastTimeGood = {
                inspectionId: this.inspections[i]._id,
                date: this.inspections[i].date
              }
              found = true;
              break;
            }
          }
          if (found) break;
        }
        if (found) break;
      }

    });
  }

  findLastTimeCheckpointsChecked() {
    this.checkpoints.forEach(checkpoint => {
      checkpoint.lastTime = {
        inspectionId: null, 
        value: null,
        date: 'Never'
      };
      var found = false;

      for (let i = 0; i < this.inspections.length; i++) {
        for (let j = 0; j < this.inspections[i].checkpoints.length; j++) {
          if(this.inspections[i].checkpoints[j]._id.equals(checkpoint._id)) {
            if(this.inspections[i].checkpoints[j].value !== null) {
              var textValue;
              if(this.inspections[i].checkpoints[j].value === 1){
                textValue = checkpoint.textValues.good;
              } else if(this.inspections[i].checkpoints[j].value === 0){
                textValue = checkpoint.textValues.attention;
              }
              checkpoint.lastTime = {
                inspectionId: this.inspections[i]._id,
                value: this.inspections[i].checkpoints[j].value,
                date: this.inspections[i].date
              }
              found = true;
              break;
            }
          }
          if (found) break;
        }
        if (found) break;
      }

    });
  }

  // Method to get the newest inspection date for this site
  getNewestInspectionDate() {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          // Check if connection exists before releasing
          if (connection) connection.release(); // Ensure connection is released
          return reject(err);
        }

        const sql = 'SELECT MAX(date_time) AS newestInspectionDate FROM inspection WHERE site_id = ?';
        
        connection.query(sql, [this.id], (err, results) => {
          connection.release(); // Release connection after query execution
          
          if (err) {
            return reject(err);
          }

          // Extract the newest inspection date from the query result
          const newestInspectionDate = results[0].newestInspectionDate;
          resolve(newestInspectionDate);
        });
      });
    });
  }

    // Method to get a site by id
  static getSiteById(siteId) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          if (connection) connection.release(); // Ensure connection is released
          return reject(err);
        }
        
        const sql = 'SELECT * FROM site WHERE id = ?';
        
        connection.query(sql, [siteId], (err, results) => {
          connection.release(); // Release connection after query execution
          
          if (err) {
            return reject(err);
          }
          
          // If site with given ID exists, resolve with the site object
          if (results.length > 0) {
            const siteData = results[0];
            const site = new Site(siteData.id, siteData.name, siteData.acronym, siteData.number, siteData.address, siteData.latlong, siteData.standard_key, siteData.key_instructions, siteData.access_instructions);
            resolve(site);
          } else {
            // If no site found with the given ID, resolve with null
            resolve(null);
          }
        });
      });
    });
  }

  // Method to add a site
  addSite() {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          if (connection) connection.release();
          return reject(err);
        }

        let sqlLatLong = 'POINT(' + this.latlong.x + ' ' + this.latlong.y + ')';

        const sql = `INSERT INTO site (name, acronym, number, address, latlong, standard_key, key_instructions, access_instructions) VALUES (?, ?, ?, ?, ST_GeomFromText('${sqlLatLong}'), ?, ?, ?)`;
        const values = [this.name, this.acronym, this.number, this.address, this.standardKey, this.keyInstructions, this.accessInstructions]

        connection.query(sql, values, (err, result) => {
          connection.release();

          if (err) {
            return reject(err);
          }

          const newSiteId = result.insertId;
          console.log('Site added successfully with ID: ', newSiteId)
          resolve(newSiteId);
        });
      });
    });
  }

  // Method to update a site
  static editSite(siteId, newName, newAcronym, newNumber, newAddress, newLat, newLong, newStandardKey, newKeyInstructions, newAccessInstructions) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          if (connection) connection.release(); // Ensure connection is released
          return reject(err);
        }

        if (newStandardKey === "true") newStandardKey = 1;
        else newStandardKey = 0;

        let newLongLat = 'POINT(' + newLong + ' ' + newLat + ')';
        
        const sql = 'UPDATE site SET name = ?, acronym = ?, number = ?, address = ?, latlong = ST_GeomFromText(\''+newLongLat+'\'), standard_key = ?, key_instructions = ?, access_instructions = ? WHERE id = ?';
        const values = [newName, newAcronym, newNumber, newAddress, newStandardKey, newKeyInstructions, newAccessInstructions, siteId];
        
        connection.query(sql, values, (err, result) => {
          connection.release(); // Release connection after query execution
          
          if (err) {
            return reject(err);
          }
          
          // Check if any rows were affected
          if (result.affectedRows > 0) {
            resolve();
          } else {
            reject(new Error('Site not found or no changes made.'));
          }
        });
      });
    });
  }

  // Method to get all sites
  static getAllSites() {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          if (connection) connection.release(); // Ensure connection is released
          return reject(err);
        }
        
        const sql = 'SELECT * FROM site ORDER BY number ASC';
        
        connection.query(sql, (err, results) => {
          connection.release(); // Release connection after query execution
          
          if (err) {
            return reject(err);
          }
          
          // Map results to Site objects
          const sites = results.map(siteData => new Site(siteData.id, siteData.name, siteData.acronym, siteData.number, siteData.address, siteData.latlong, siteData.standard_key, siteData.key_instructions, siteData.access_instructions));
          resolve(sites);
        });
      });
    });
  }

  static deleteSite(siteId) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          // Check if connection exists before releasing
          if (connection) connection.release(); // Ensure connection is released
          return reject(err);
        }
        
        const sql = 'DELETE FROM site WHERE id = ?';
        
        connection.query(sql, [siteId], (err, result) => {
          connection.release(); // Release connection after query execution
          
          if (err) {
            return reject(err);
          }
          
          // Check if any rows were affected
          if (result.affectedRows > 0) {
            resolve();
          } else {
            reject(new Error('Site not found.'));
          }
        });
      });
    });
  }
  
}

module.exports = Site;