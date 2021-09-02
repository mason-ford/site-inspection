var DbConnection = require('../database/db');
var ObjectId = require('mongodb').ObjectID;
const collection = 'sites';

class Site {

  constructor(id,name,acronym,number,address,airfilter,contact,checkpoints,inspections) {
    this.id = id;
    this.name = name;
    this.acronym = acronym;
    this.number = number;
    this.address = address;
    this.airfilter = airfilter;
    this.contact = contact;
    this.checkpoints = checkpoints;
    this.inspections = inspections;

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

  async addSite() {
    try {
      var newCheckpoints = [];
      this.checkpoints.forEach(checkpoint => {
            newCheckpoints.push(new ObjectId(checkpoint));
      });
      let newSite = {name: this.name, acronym: this.acronym, number: this.number, address: this.address, airfilter: this.airfilter, contact: this.contact, checkpoints: newCheckpoints};
      let db = await DbConnection.Get();
      let result = await db.collection(collection).insertOne(newSite);

      return result.insertedId;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async editSite() {
    try {
      var newCheckpoints = [];
      this.checkpoints.forEach(checkpoint => {
          newCheckpoints.push(new ObjectId(checkpoint));
      });
      let newValues = { $set: {name: this.name, acronym: this.acronym, number: this.number, address: this.address, airfilter: this.airfilter, contact: this.contact, checkpoints: newCheckpoints}};
      let db = await DbConnection.Get();
      let result = await db.collection(collection).updateOne({_id: new ObjectId(this.id)}, newValues);

      return result;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  static async getSite(id) {
    try {
      let db = await DbConnection.Get();
      let result = await db.collection(collection).aggregate([
        {
          '$match': {
            '_id': new ObjectId(id)
          }
        }, {
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
            }, 
            'contact': {
              '$first': '$contact'
            }
          }
        }
      ]).toArray();
      let s = result[0];
      let newSite = new Site(s._id, s.name, s.acronym, s.number, s.address, s.airfilter, s.contact, s.checkpoints);
      return newSite;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  static async getAllSites() {
    try {
      let db = await DbConnection.Get();
      let result = await db.collection(collection).aggregate( [ { $sort: { number: 1 } } ] ).toArray();

      return result;
    } catch (e) {
      console.log(e);
      return e;
    }
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
        returnSites.push(new Site(result[i]._id, result[i].name, result[i].acronym, result[i].number, result[i].address, result[i].airfilter, null, result[i].checkpoints, result[i].inspections));
      }

      return returnSites;
    } catch (e) {
      console.log(e);
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
          var newSite = new Site(s._id, s.name, s.acronym, s.number, s.address, s.airfilter, s.checkpoints, s.contact, s.inspections);
          newSite.findNewestInspection();
          sitesArray.push(newSite);
        });

        return sitesArray;
    } catch (e) {
        console.log(e);
        return e;
    }
  }

}

module.exports = Site;