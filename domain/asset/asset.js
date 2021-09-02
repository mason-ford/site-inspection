var DbConnection = require('../../database/db');
var ObjectId = require('mongodb').ObjectID;
const collection = 'asset';

class Asset {

    constructor(id,modelId,agencyId,serialNumber,location) {
        this.id = id;
        this.modelId = modelId;
        this.agencyId = agencyId;
        this.serialNumber = serialNumber;
        this.location = location;
        this.status = status;
        this.deployDate = deployDate;
        this.deployBy = deployBy;
        this.poNumber = poNumber;
        this.properties = properties;
    }

    async add() {
        try {
            let db = await DbConnection.Get();
            let result = await db.collection(collection).insertOne({ 
                modelId: this.modelId,
                agencyId: this.agencyId,
                serialNumber: this.serialNumber,
                location: this.location,
                status: this.status,
                deployDate: this.deployDate,
                deployBy: this.deployBy,
                poNumber: this.poNumber,
                properties: this.properties
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
                {
                    modelId: this.modelId,
                    agencyId: this.agencyId,
                    serialNumber: this.serialNumber,
                    location: this.location,
                    status: this.status,
                    deployDate: this.deployDate,
                    deployBy: this.deployBy,
                    poNumber: this.poNumber,
                    properties: this.properties
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

            return new Asset(
                result._id,
                result.modelId,
                result.agencyId,
                result.serialNumber,
                result.location,
                result.status,
                result.deployDate,
                result.deployBy,
                result.poNumber,
                result.properties
            );
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    static async getAll() {
        try {
            let db = await DbConnection.Get();
            let result = await db.collection(collection).aggregate( [ { $sort: { serialNumber: 1 } } ] ).toArray();
      
            let assets = [];
            for(let i=0; i<result.length; i++) {
                assets.push(new Model(
                    result[i]._id,
                    result[i].modelId,
                    result[i].agencyId,
                    result[i].serialNumber,
                    result[i].location,
                    result[i].status,
                    result[i].deployDate,
                    result[i].deployBy,
                    result[i].poNumber,
                    result[i].properties
                ));
            }

            return assets;
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    static async getAllforModelType(id) {
        try {
            let db = await DbConnection.Get();
            let result = await db.collection(collection).find( { modelId: new ObjectId(id) } ).sort( { serialNumber: 1 } ).toArray();
      
            let assets = [];
            for(let i=0; i<result.length; i++) {
                assets.push(new Model(
                    result[i]._id,
                    result[i].modelId,
                    result[i].agencyId,
                    result[i].serialNumber,
                    result[i].location,
                    result[i].status,
                    result[i].deployDate,
                    result[i].deployBy,
                    result[i].poNumber,
                    result[i].properties
                ));
            }

            return assets;
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    static async getAllforAgency(id) {
        try {
            let db = await DbConnection.Get();
            let result = await db.collection(collection).find( { agencyId: new ObjectId(id) } ).sort( { serialNumber: 1 } ).toArray();
      
            let assets = [];
            for(let i=0; i<result.length; i++) {
                assets.push(new Model(
                    result[i]._id,
                    result[i].modelId,
                    result[i].agencyId,
                    result[i].serialNumber,
                    result[i].location,
                    result[i].status,
                    result[i].deployDate,
                    result[i].deployBy,
                    result[i].poNumber,
                    result[i].properties
                ));
            }

            return assets;
        } catch (e) {
            console.log(e);
            return e;
        }
    }

}

module.exports = Asset;