var express = require('express');
var moment = require('moment');
var router = express.Router();
const Model = require('../domain/asset/model');
const AssetType = require('../domain/asset/asset-type');

const menuId = 'model';

router.get('/', (req, res) => {
    console.log('Get all models');

    Model.getAll().then(models => {
        res.render('model/model', {page: 'Models', menuId: menuId, models: models, moment: moment})
    });

});

router.get('/model/:id', (req, res) => {
    console.log('Get model ' + req.params.id);
  
    let id = req.params.id;
    Model.get(id).then(model => {
      res.render('model/model-single', {page:'Model', menuId: menuId, model: model});
    });
});

router.get('/add', (req, res) => {
    console.log('Add model page');

    AssetType.getAll().then(returnTypes => {
        res.render('model/model-add', {page: 'Add Model', menuId: menuId, types: returnTypes});
    })
});

router.post('/add', (req, res) => {
    console.log('Add Model');

    let model = req.body.model_model;
    let name = req.body.model_name;
    let typeId = req.body.model_type;
    let description = req.body.model_description;
    let manufacturer = req.body.model_manufacturer;

    let assetType = new AssetType(typeId, null, null, null);

    let newModel = new Model(null, assetType, model, name, description, manufacturer);
    newModel.add().then(id => {
        res.redirect('/model/');
    });

});

router.get('/edit/:id', (req, res) => {
    console.log('Edit model page');
  
    let id = req.params.id;
    var types;
    AssetType.getAll().then(returnTypes => {
        types = returnTypes;
        return Model.get(id);
    }).then(model => {
        console.log(types[1].id);
        console.log(model.type.id);
        console.log(types[1].id.equals(model.type.id));
        res.render('model/model-edit', {page:'Model Edit', menuId: menuId, model: model, types: types});
    });
});

router.post('/edit/:id', (req, res) => {
    console.log('Edit model');
  
    let id = req.params.id;
    let model = req.body.model_model;
    let name = req.body.model_name;
    let typeId = req.body.model_type;
    let description = req.body.model_description;
    let manufacturer = req.body.model_manufacturer;

    let assetType = new AssetType(typeId, null, null, null);
    
    let newModel = new Model(id, assetType, model, name, description, manufacturer);
    newModel.edit().then(result => {
      res.redirect('/model/model/'+id);
    });
});

module.exports = router;