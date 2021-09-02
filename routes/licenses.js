var express = require('express');
var moment = require('moment');
var router = express.Router();
const License = require('../domain/license/license');

var fs = require('fs');
var path = require('path');

const menuId = 'license';
const licenseFolder = './private/uploads/licenses/';
const extension = '.xml';

router.get('/', (req, res) => {
    var license = [];
    res.render('licenses/license', {page: 'Licenses', menuId: menuId, license: license, moment: moment});
});

router.get('/addLicenses', (req, res) => {

    console.log('Get all licenses');

    var license = [];

    fs.readdir(licenseFolder, (err, files) => {
        if (err) {
            console.log(err);
            res.render('error', {message: "Read File Error", error: err});
            return;
        }

        var xmlFiles = [];
        for (let i=0; i < files.length; i++) {
            if(path.extname(files[i]).toLowerCase() === extension) {
                xmlFiles.push(files[i]);
            }
        }

        for (let i=0; i < xmlFiles.length; i++) {
            var licenseResult;
            License.parseFile(xmlFiles[i]).then(result => {
                if(result.err) {
                    res.render('error', {message: "Read or Parse File Error", error: result.err});
                } else {
                    licenseResult = result.license;
                    return result.license.addLicense();
                }
            }).then(id => {
                license.push(licenseResult);
                if(license.length === xmlFiles.length) {
                    res.render('licenses/license-table', {page: 'Licenses', menuId: menuId, license: license, moment: moment});
                }
            });
        }
    });
});

router.get('/map', (req, res) => {
    console.log('License map');

    res.render('licenses/license-map', {page: 'License Map', menuId: menuId});
});

router.get('/json', (req, res) => {
    console.log('Get all licenses JSON');

    License.getAllLicenses().then(licenses => {
        res.json(JSON.stringify(licenses));
    });

});

router.post('/json', (req, res) => {
    console.log('Get licenses filtered JSON');

    var filter = [];
    if(req.body.licNumber && req.body.licNumber !== "") {
        filter.push({"number": req.body.licNumber});
    }

    if(req.body.stnName && req.body.stnName !== "") {
        var stnName = req.body.stnName.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        filter.push({"station.name": {$regex: ".*"+stnName+".*", $options: "im"}});
    }

    if(req.body.chTxFreq && req.body.chTxFreq !== "") {
        var chTxFreq = (Number(req.body.chTxFreq)*1000000).toFixed(0);
        filter.push({"station.channel.transmitter.frequency": chTxFreq});
    }

    if(req.body.chRxFreq && req.body.chRxFreq !== "") {
        var chRxFreq = (Number(req.body.chRxFreq)*1000000).toFixed(0);
        filter.push({"station.channel.receiver.frequency": chRxFreq});
    }

    if(req.body.licStatus && req.body.licStatus !== "" && req.body.licStatus !== "Any") {
        filter.push({"status": { "$in" : req.body.licStatus } });
    }

    if(req.body.licTags && req.body.licTags !== "") {
        var tagsArr = req.body.licTags.split(",").map(function(item) {
            return item.trim();
        });
        filter.push({"tags": { $in: tagsArr}});
    }

    if(filter.length > 1) {
        filter = {"$and": filter}
    } else {
        filter = filter[0];
    }

    console.log(filter);
    License.filterLicenses(filter).then(licenses => {
        console.log("Found "+licenses.length);
        res.json(JSON.stringify(licenses));
    });

});

router.get('/json/:id', (req, res) => {
    console.log('Get license '+req.params.id);

    let id = req.params.id;
    License.getLicense(id).then(license => {
        res.render('licenses/license-edit', { license: license });
    });

});

router.post('/update', (req, res) => {
    console.log('Update License');

    var tagsArr = req.body.tags.split(",").map(function(item) {
        return item.trim();
    });
    console.log("Tags"+tagsArr);
    License.updateLicense(req.body.licenseNumber, req.body.status, tagsArr, req.body.comment).then(result => {
        res.json(JSON.stringify(result));
    });

});

module.exports = router;