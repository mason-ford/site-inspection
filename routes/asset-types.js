var express = require('express');
var moment = require('moment');
var router = express.Router();
const AssetType = require('../domain/asset/asset-type');

const menuId = 'assetType';

router.get('/', (req, res) => {
    console.log('Get all asset-types');

    AssetType.getAll().then(assetTypes => {
        res.render('asset-type/asset-type', {page: 'Asset Types', menuId: menuId, assetTypes: assetTypes, moment: moment})
    });

});

router.get('/asset-type/:id', (req, res) => {
    console.log('Get asset-type ' + req.params.id);
  
    let id = req.params.id;
    AssetType.get(id).then(assetType => {
      res.render('asset-type/asset-type-single', {page:'Asset Type', menuId: menuId, assetType: assetType});
    });
});

router.get('/add', (req, res) => {
    console.log('Add asset-type page');

    res.render('asset-type/asset-type-add', {page: 'Add Asset Type', menuId: menuId});
});

router.post('/add', (req, res) => {
    console.log('Add asset-type');

    let name = req.body.assetType_name;
    let description = req.body.assetType_description;

    let assetType = new AssetType(null, name, description, []);
    assetType.add().then(id => {
        res.redirect('/asset-type/');
    });

});

router.get('/edit/:id', (req, res) => {
    console.log('Edit asset-type page');
  
    let id = req.params.id;
    AssetType.get(id).then(assetType => {
      res.render('asset-type/asset-type-edit', {page:'Asset Type Edit', menuId: menuId, assetType: assetType});
    });
});

router.post('/edit/:id', (req, res) => {
    console.log('Edit asset-type');
  
    let id = req.params.id;
    let name = req.body.assetType_name;
    let description = req.body.assetType_description;
    
    let assetType = new AssetType(id, name, description, []);
    assetType.edit().then(result => {
      res.redirect('/asset-type/asset-type/'+id);
    })
});

module.exports = router;