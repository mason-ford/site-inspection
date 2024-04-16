class Model {

    constructor(id,type,model,name,description,manufacturer) {
        this.id = id;
        this.type = type;
        this.model = model;
        this.name = name;
        this.description = description;
        this.manufacturer = manufacturer;
    }

    async add() {
        try {
            let db = await DbConnection.Get();
            let result = await db.collection(collection).insertOne({
                assetTypeId: new ObjectId(this.type.id),
                model: this.model,
                name: this.name, 
                description: this.description,
                manufacturer: this.manufacturer
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
                        assetTypeId: new ObjectId(this.type.id),
                        model: this.model,
                        name: this.name, 
                        description: this.description,
                        manufacturer: this.manufacturer
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
            let result = await db.collection(collection).aggregate( [
                {
                  '$match': {
                    '_id': new ObjectId(id)
                  }
                }, {
                  '$lookup': {
                    'from': 'asset_type', 
                    'localField': 'assetTypeId', 
                    'foreignField': '_id', 
                    'as': 'type'
                  }
                }, {
                  '$unwind': {
                    'path': '$type', 
                    'preserveNullAndEmptyArrays': true
                  }
                }
              ] ).toArray();

            return new Model(
                result[0]._id,
                new AssetType(result[0].type._id, result[0].type.name,result[0].type.description,result[0].type.property),
                result[0].model,
                result[0].name,
                result[0].description,
                result[0].manufacturer
            )
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    static async getAll() {
        try {
            let db = await DbConnection.Get();
            let result = await db.collection(collection).aggregate( [
                {
                  '$lookup': {
                    'from': 'asset_type', 
                    'localField': 'assetTypeId', 
                    'foreignField': '_id', 
                    'as': 'type'
                  }
                }, {
                  '$unwind': {
                    'path': '$type', 
                    'preserveNullAndEmptyArrays': true
                  }
                }, {
                  '$sort': {
                    'name': 1
                  }
                }
              ] ).toArray();
      
            let models = [];
            for(let i=0; i<result.length; i++) {
                models.push(new Model(
                    result[i]._id,
                    new AssetType(result[i].type._id, result[i].type.name,result[i].type.description,result[i].type.property),
                    result[i].model,
                    result[i].name,
                    result[i].description,
                    result[i].manufacturer
                ));
            }

            return models;
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    /*static async getAllforAssetType(id) {
        try {
            let db = await DbConnection.Get();
            let result = await db.collection(collection).find( { assetTypeId: new ObjectId(id) } ).sort( { model: 1 } ).toArray();
      
            let models = [];
            for(let i=0; i<result.length; i++) {
                models.push(new Model(
                    result[i]._id,
                    result[i].type,
                    result[i].model,
                    result[i].name,
                    result[i].description,
                    result[i].manufacturer
                ));
            }

            return models;
        } catch (e) {
            console.log(e);
            return e;
        }
    }*/

}

module.exports = Model;