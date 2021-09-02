var express = require('express');
var moment = require('moment');
var router = express.Router();
const Agency = require('../domain/asset/agency');

const menuId = 'agency';

router.get('/', (req, res) => {
    console.log('Get all agencies');

    Agency.getAll().then(agencies => {
        res.render('agency/agency', {page: 'Agencies', menuId: menuId, agencies: agencies, moment: moment})
    });

});

router.get('/agency/:id', (req, res) => {
    console.log('Get agency ' + req.params.id);
  
    let id = req.params.id;
    Agency.get(id).then(agency => {
      res.render('agency/agency-single', {page:'Agency', menuId: menuId, agency: agency});
    });
});

router.get('/add', (req, res) => {
    console.log('Add agency page');

    res.render('agency/agency-add', {page: 'Add Agency', menuId: menuId});
});

router.post('/add', (req, res) => {
    console.log('Add Agency');

    let name = req.body.agency_name;
    let acronym = req.body.agency_acronym;
    let description = req.body.agency_description;

    let agency = new Agency(null, name, acronym, description);
    agency.add().then(id => {
        res.redirect('/agency/');
    });

});

router.get('/edit/:id', (req, res) => {
    console.log('Edit agency page');
  
    let id = req.params.id;
    Agency.get(id).then(agency => {
      res.render('agency/agency-edit', {page:'Agency Edit', menuId: menuId, agency: agency});
    });
});

router.post('/edit/:id', (req, res) => {
    console.log('Edit agency');
  
    let id = req.params.id;
    let name = req.body.agency_name;
    let acronym = req.body.agency_acronym;
    let description = req.body.agency_description;
    
    let agency = new Agency(id, name, acronym, description);
    agency.edit().then(result => {
      res.redirect('/agency/agency/'+id);
    })
});

module.exports = router;