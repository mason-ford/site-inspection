var DbConnection = require('../database/db');
var ObjectId = require('mongodb').ObjectID;
const collection = 'inspections';
var pool = require('../database/mysql');

class Inspection {

  constructor(id, siteId, dateTime, information, userName, userId) {
    this.id = id;
    this.siteId = siteId;
    this.dateTime = dateTime;
    this.information = information
    this.userName = userName;
    this.userId = userId;
  }

  async addInspection() {
    try {
      var newCheckpoints = [];
      this.checkpoints.forEach(checkpoint => {
        let value = null;
        if (checkpoint.value === "true") {
          value = 1;
        } else if (checkpoint.value === "false") {
          value = 0;
        }
        var newCheckpoint = {
          _id: new ObjectId(checkpoint.id),
          value: value,
          note: checkpoint.note
        }
        if (checkpoint.photo) {
          newCheckpoint.photo = checkpoint.photo;
        }
        newCheckpoints.push(newCheckpoint);
      });
      var newSiteId = new ObjectId(this.site_id);
      let newInspection = { date: this.date, site_id: newSiteId, user: this.user, checkpoints: newCheckpoints };
      let db = await DbConnection.Get();
      let result = await db.collection(collection).insertOne(newInspection);

      return result.insertedId;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  static async getInspection(id) {
    try {
      let db = await DbConnection.Get();
      let result = await db.collection(collection).aggregate([
        {
          '$match': {
            '_id': new ObjectId(id)
          }
        }, {
          '$lookup': {
            'from': 'sites',
            'localField': 'site_id',
            'foreignField': '_id',
            'as': 'site'
          }
        }, {
          '$unwind': {
            'path': '$site',
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$unwind': {
            'path': '$checkpoints',
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$lookup': {
            'from': 'checkpoints',
            'localField': 'checkpoints._id',
            'foreignField': '_id',
            'as': 'checkpointInfo'
          }
        }, {
          '$unwind': {
            'path': '$checkpointInfo',
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$addFields': {
            'checkpoints': {
              '$mergeObjects': [
                '$checkpoints', '$checkpointInfo'
              ]
            }
          }
        }, {
          '$project': {
            'checkpoints.type': 0,
            'checkpointInfo': 0,
            'site.checkpoints': 0
          }
        }, {
          '$sort': {
            'checkpoints.name': 1
          }
        }, {
          '$group': {
            '_id': '_id',
            'date': {
              '$first': '$date'
            },
            'site': {
              '$first': '$site'
            },
            'user': {
              '$first': '$user'
            },
            'checkpoints': {
              '$push': '$checkpoints'
            }
          }
        }
      ]).toArray();

      return result[0];
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  static getAllInspections() {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          connection.release(); // Ensure connection is released
          return reject(err);
        }

        const sql = 'SELECT * FROM inspection';

        connection.query(sql, (err, results) => {
          connection.release(); // Release connection after query execution

          if (err) {
            return reject(err);
          }
          console.log(results);
          const inspections = results.map(inspectionData => new Inspection(inspectionData.id, inspectionData.site_id, inspectionData.date_time, inspectionData.information, inspectionData.user_name, inspectionData.user_id));
          resolve(inspections);
        });
      });
    });
  }

  static async getInspectionsForSite(id) {
    try {
      let db = await DbConnection.Get();
      let result = await db.collection(collection).aggregate([
        {
          '$match': {
            'site_id': new ObjectId(id)
          }
        }, {
          '$unwind': {
            'path': '$checkpoints',
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$lookup': {
            'from': 'checkpoints',
            'localField': 'checkpoints._id',
            'foreignField': '_id',
            'as': 'check'
          }
        }, {
          '$unwind': {
            'path': '$check',
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$sort': {
            'check.name': 1
          }
        }, {
          '$group': {
            '_id': '$_id',
            'date': {
              '$first': '$date'
            },
            'user': {
              '$first': '$user'
            },
            'checkpoints': {
              '$push': {
                '_id': '$checkpoints._id',
                'name': '$check.name',
                'description': '$check.description',
                'textValues': '$check.textValues',
                'value': '$checkpoints.value',
                'note': '$checkpoints.note'
              }
            }
          }
        }, {
          '$project': {
            'date': 1,
            'user': 1,
            'checkpoints': 1,
            'results': {
              'good': {
                '$size': {
                  '$filter': {
                    'input': '$checkpoints',
                    'as': 'checks',
                    'cond': {
                      '$eq': [
                        '$$checks.value', 1
                      ]
                    }
                  }
                }
              },
              'attention': {
                '$size': {
                  '$filter': {
                    'input': '$checkpoints',
                    'as': 'checks',
                    'cond': {
                      '$eq': [
                        '$$checks.value', 0
                      ]
                    }
                  }
                }
              },
              'na': {
                '$size': {
                  '$filter': {
                    'input': '$checkpoints',
                    'as': 'checks',
                    'cond': {
                      '$eq': [
                        '$$checks.value', null
                      ]
                    }
                  }
                }
              }
            }
          }
        }, {
          '$sort': {
            'date': -1
          }
        }
      ]).toArray();

      return result;
    } catch (e) {
      console.log(e);
      return e;
    }
  }
}

module.exports = Inspection;