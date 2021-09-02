var fs = require('fs').promises;
var xml2js = require('xml2js');
const Station = require('./station');
const licenseFolder = './private/uploads/licenses/';

var DbConnection = require('../../database/db');
const collection = 'licenses';

class License {

    constructor(parsed) {
        var license = parsed.SPECTRAExchangeEssential.APPLICATION;
        this.status = "Active";
        this.number = license.AP_NAME;
        this.dateStart = license.LI_LIC_DATE;
        this.station = [];
        
        if(license.STATION) {
            if(license.STATION.length > 0) {
                for(let i=0; i < license.STATION.length; i++) {
                    this.station.push(new Station(license.STATION[i]));
                }
            } else {
                this.station.push(new Station(license.STATION));
            }
        };
    }

    static async filterLicenses(filter) {
        try {
            let db = await DbConnection.Get();
            let result = await db.collection(collection).find(filter).sort( { number: 1 } ).toArray();
    
            return result;
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    static async getAllLicenses() {
        try {
            let db = await DbConnection.Get();
            let result = await db.collection(collection).aggregate( [ { $sort: { number: 1 } } ] ).toArray();
    
            return result;
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    static async getLicense($id) {
        try {
            let db = await DbConnection.Get();
            let result = await db.collection(collection).find( { number: $id } ).limit(1).toArray();

            return result;
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    async addLicense() {
        try {
            //let newLicense = JSON.parse(this);
            let db = await DbConnection.Get();
            let result = await db.collection(collection).insertOne(this);
    
            return result.insertedId;
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    static async parseFile(filename) {
        try {
            let read = await fs.readFile(licenseFolder+filename, 'utf8');
            var parser = new xml2js.Parser({explicitArray: false});
            let parsed = await parser.parseStringPromise(read); 
            let license = new License(parsed);
            return {license: license};
        } catch (e) {
            return {err: e};
        }
    }

    static async updateLicense(number, status, tags, comment) {
        try {
            let newValues = { $set: {status: status, tags: tags, comment: comment}};
            let db = await DbConnection.Get();
            let result = await db.collection(collection).updateOne({number: number}, newValues);
    
            return result.result;
        } catch (e) {
            console.log(e);
            return e;
        }
    }

}

module.exports = License;