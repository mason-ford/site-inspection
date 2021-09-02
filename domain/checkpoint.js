var DbConnection = require('../database/db');
var ObjectId = require('mongodb').ObjectID;
const collection = 'checkpoints';

class Checkpoint {

    constructor(id,name,textValues,description) {
        this.id = id;
        this.name = name;
        this.textValues = textValues;
        this.description = description;
    }

    async addCheckpoint() {
        try {
            let newCheckpoint = {name: this.name, textValues: this.textValues, description: this.description};
            let db = await DbConnection.Get();
            let result = await db.collection(collection).insertOne(newCheckpoint);
    
            return result.insertedId;
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    async editCheckpoint() {
        try {
            let newValues = { $set: {name: this.name, textValues: this.textValues, description: this.description}};
            let db = await DbConnection.Get();
            let result = await db.collection(collection).updateOne({_id: new ObjectId(this.id)}, newValues);
    
            return result;
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    static async getCheckpoint(id) {
        try {
            let db = await DbConnection.Get();
            let result = await db.collection(collection).findOne({_id: new ObjectId(id)});

            return result;
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    static deleteAgencyByIdSQL(id) {
        let sql = `DELETE FROM AGENCY WHERE ID = ${id}`;
        return sql;
    }

    static async getAllCheckpoints() {
        try {
            let db = await DbConnection.Get();
            let result = await db.collection(collection).aggregate( [ { $sort: { name: 1 } } ] ).toArray();
    
            return result;
        } catch (e) {
            console.log(e);
            return e;
        }
    }
}

module.exports = Checkpoint;