var DbConnection = require('../../database/db');
var ObjectId = require('mongodb').ObjectID;
const collection = 'asset_type';

class AssetType {

    constructor(id,name,description,property) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.property = property;
    }

    async add() {
        try {
            let db = await DbConnection.Get();
            let result = await db.collection(collection).insertOne({ 
                name: this.name, 
                description: this.description,
                property: this.property
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
                        description: this.description,
                        property: this.property
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

            return new AssetType(
                result._id,
                result.name,
                result.description,
                result.property
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

            let assetTypes = [];
            for(let i=0; i<result.length; i++) {
                assetTypes.push(new AssetType(
                    result[i]._id,
                    result[i].name,
                    result[i].description,
                    result[i].property
                ));
            }
      
            return assetTypes;
        } catch (e) {
            console.log(e);
            return e;
        }
    }

}

module.exports = AssetType;