var DbConnection = require('../database/db');
var pool  = require('../database/mysql')
var ObjectId = require('mongodb').ObjectID;
const collection = 'sites';

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

  findNewestInspection() {
    if(this.inspections.length > 0) {
      var newestInspection = this.inspections[0];
      for(var ins in this.inspections) {
        if(this.inspections[ins].date > newestInspection.date) {
          newestInspection = this.inspections[ins];
        }
      }
      this.newestInspection = newestInspection;
    } else {
      this.newestInspection = null;
    }
  }

  findOldestInspection() {
    if(this.inspections.length > 0) {
      var oldestInspection = this.inspections[0];
      for(var ins in this.inspections) {
        if(this.inspections[ins].date < oldestInspection.date) {
          oldestInspection = this.inspections[ins];
        }
      }
      this.oldestInspection = oldestInspection;
    } else {
      this.oldestInspection = null;
    }
  }

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

  static getSite(siteId) {
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

  static getAllSites() {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          if (connection) connection.release(); // Ensure connection is released
          return reject(err);
        }
        
        const sql = 'SELECT * FROM site';
        
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

  static async getAllSitesWithInfo() {
    try {
      let db = await DbConnection.Get();
      let result = await db.collection(collection).aggregate([
        {
          '$unwind': {
            'path': '$checkpoints', 
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$lookup': {
            'from': 'checkpoints', 
            'localField': 'checkpoints', 
            'foreignField': '_id', 
            'as': 'checkpoint'
          }
        }, {
          '$unwind': {
            'path': '$checkpoint', 
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$sort': {
            'checkpoint.name': 1
          }
        }, {
          '$group': {
            '_id': '$_id', 
            'name': {
              '$first': '$name'
            }, 
            'acronym': {
              '$first': '$acronym'
            }, 
            'number': {
              '$first': '$number'
            }, 
            'address': {
              '$first': '$address'
            }, 
            'airfilter': {
              '$first': '$airfilter'
            }, 
            'checkpoints': {
              '$push': '$checkpoint'
            }
          }
        }, {
          '$lookup': {
            'from': 'inspections', 
            'localField': '_id', 
            'foreignField': 'site_id', 
            'as': 'inspections'
          }
        }, {
          '$unwind': {
            'path': '$inspections', 
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$sort': {
            'inspections.date': 1
          }
        }, {
          '$group': {
            '_id': '$_id', 
            'name': {
              '$first': '$name'
            }, 
            'acronym': {
              '$first': '$acronym'
            }, 
            'number': {
              '$first': '$number'
            }, 
            'address': {
              '$first': '$address'
            }, 
            'airfilter': {
              '$first': '$airfilter'
            }, 
            'checkpoints': {
              '$first': '$checkpoints'
            }, 
            'inspections': {
              '$push': '$inspections'
            }
          }
        }, {
          '$sort': {
            'number': 1
          }
        }
      ]).toArray();
      var returnSites = [];
      
      for(let i = 0; i < result.length; i++) {
        returnSites.push(new Site(result[i]._id, result[i].name, result[i].acronym, result[i].number, result[i].address, "", result[i].airfilter, null, result[i].checkpoints, result[i].inspections));
      }

      return returnSites;
    } catch (e) {
      console.log(`ERROR! : ${e}`);
      return e;
    }
  }

  static async getAllSitesWithInspectionInfo() {
    try {
        let db = await DbConnection.Get();
        let result = await db.collection(collection).aggregate([
          {
              '$lookup': {
                  'from': 'inspections', 
                  'localField': '_id', 
                  'foreignField': 'site_id', 
                  'as': 'inspections'
              }
          }, {
              '$sort': {
                  'number': 1
              }
          }
      ]).toArray();

        var sitesArray = [];
        result.forEach(s => {
          var newSite = new Site(s._id, s.name, s.acronym, s.number, s.address, "", s.airfilter, s.checkpoints, s.contact, s.inspections);
          newSite.findNewestInspection();
          sitesArray.push(newSite);
        });

        return sitesArray;
    } catch (e) {
        console.log(e);
        return e;
    }
  }

  static deleteSite(siteId) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          connection.release(); // Ensure connection is released
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