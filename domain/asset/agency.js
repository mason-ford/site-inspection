var DbConnection = require('../../database/db');
var ObjectId = require('mongodb').ObjectID;
const collection = 'agency';

class Agency {

    constructor(id,name,acronym,description) {
        this.id = id;
        this.name = name;
        this.acronym = acronym;
        this.description = description;
    }

    async add() {
        try {
            let db = await DbConnection.Get();
            let result = await db.collection(collection).insertOne({ 
                name: this.name, 
                acronym: this.acronym,
                description: this.description
            });

            return result.insertedId;
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    async edit() {
        try {
            let db = await DbConnection.Get();
            let result = await db.collection(collection).updateOne(
                { _id: new ObjectId(this.id) },
                { $set: {
                        name: this.name, 
                        acronym: this.acronym,
                        description: this.description
                    }
                }
            );

            return result;
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    static async get(id) {
        try {
            let db = await DbConnection.Get();
            let result = await db.collection(collection).findOne({ 
                _id: new ObjectId(id) 
            });

            return new Agency(
                result._id,
                result.name,
                result.acronym,
                result.description
            );
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    static async getAll() {
        try {
            let db = await DbConnection.Get();
            let result = await db.collection(collection).aggregate( [ { $sort: { name: 1 } } ] ).toArray();

            let agencies = [];
            for(let i=0; i<result.length; i++) {
                agencies.push(new Agency(
                    result[i]._id,
                    result[i].name,
                    result[i].acronym,
                    result[i].description
                ));
            }
      
            return agencies;
        } catch (e) {
            console.log(e);
            return e;
        }
    }

}

module.exports = Agency;