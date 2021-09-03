var express = require('express');
var moment = require('moment');
var router = express.Router();
const Site = require('../domain/site');
const Checkpoint = require('../domain/checkpoint');
const Inspection = require('../domain/inspection');
const Task = require('../domain/task');

const menuId = 'site';

router.get('/', (req, res) => {
  console.log('Get all sites');

  Site.getAllSitesWithInspectionInfo().then(sites => {
    res.render('sites/sites', {page:'Sites', menuId: menuId, sites: sites, moment: moment});
  });
});

router.get('/site/:id', (req, res) => {
  console.log('Get site ' + req.params.id);

  let id = req.params.id;
  var returnSite;
  Site.getSite(id).then(site => {
    returnSite = site;
    return Inspection.getInspectionsForSite(id);
  }).then(inspections => {
    returnSite.inspections = inspections;
    returnSite.findLastTimeCheckpointsChecked();
    returnSite.findLastTimeCheckpointsGood();
    return Task.getTasksForSite(id);
  }).then(tasks => {
    //console.log(tasks);
    returnSite.tasks = tasks;
    res.render('sites/sites-single', {moment: moment, page:'Site', menuId: menuId, site: returnSite, moment: moment})
  });
});

router.get('/add', (req, res) => {
  console.log('Add site page');

  Checkpoint.getAllCheckpoints().then(checkpoints => {
    res.render('sites/sites-add', {page: 'Add Site', menuId: menuId, checkpoints: checkpoints});
  });
});

router.post('/add', (req, res) => {
  console.log('Add site');

  let name = req.body.site_name;
  let acronym = req.body.site_acronym;
  let number = req.body.site_number;
  let address = req.body.site_address;

  if(req.body.site_checkpoints === undefined) {
    var checkpoints = [];
  } else {
    var checkpoints = req.body.site_checkpoints;
  }

  if(req.body.airfilter_type === undefined) {
    var airfilter = [];
  } else {
    var airfilter_type = req.body.airfilter_type;
    var airfilter_size = req.body.airfilter_size;
    var airfilter_amount = req.body.airfilter_amount;

    var airfilter = [];
    for(let i=0; i < airfilter_type.length; i++) {
      if(airfilter_type[i] !== "") {
        airfilter.push({
          type: airfilter_type[i],
          size: airfilter_size[i],
          amount: airfilter_amount[i]
        });
      }
    }
  }

  if(req.body.contact_name === undefined) {
    var contact = [];
  } else {
    var contact_name = req.body.contact_name;
    var contact_number = req.body.contact_number;
    var contact_info = req.body.contact_info;

    var contact = [];
    for(let i=0; i < contact_name.length; i++) {
      if(contact_name[i] !== "") {
        contact.push({
          name: contact_name[i],
          number: contact_number[i],
          info: contact_info[i]
        });
      }
    }
  }

  let site = new Site(null, name, acronym, number, address, airfilter, contact, checkpoints);
  site.addSite().then(id => {
    res.redirect('/sites/site/'+id);
  });
});

router.get('/edit/:id', (req, res) => {
  console.log('Update site page');

  let id = req.params.id;
  var returnSite;
  Site.getSite(id).then(site => {
    returnSite = site;
    console.log(returnSite);
    return Checkpoint.getAllCheckpoints();
  }).then(checkpoints => {
    checkpoints.forEach(checkpoint => {
      checkpoint.added = false;
      returnSite.checkpoints.forEach(check => {
        if(check._id.equals(checkpoint._id)) checkpoint.added = true;
      })
    });
    returnSite.checkpoints = checkpoints;
    res.render('sites/sites-edit', {page:'Site Edit', menuId: menuId, site: returnSite});
  });
});

router.post('/edit/:id', (req, res) => {
  console.log('Update site');

  let id = req.params.id;
  let name = req.body.site_name;
  let acronym = req.body.site_acronym;
  let number = req.body.site_number;
  let address = req.body.site_address;

  if(req.body.site_checkpoints === undefined) {
    var checkpoints = [];
  } else {
    var checkpoints = req.body.site_checkpoints;
  }

  if(req.body.airfilter_type === undefined) {
    var airfilter = [];
  } else {
    var airfilter_type = req.body.airfilter_type;
    var airfilter_size = req.body.airfilter_size;
    var airfilter_amount = req.body.airfilter_amount;

    var airfilter = [];
    for(let i=0; i < airfilter_type.length; i++) {
      if(airfilter_type[i] !== "") {
        airfilter.push({
          type: airfilter_type[i],
          size: airfilter_size[i],
          amount: airfilter_amount[i]
        });
      }
    }
  }

  if(req.body.contact_name === undefined) {
    var contact = [];
  } else {
    var contact_name = req.body.contact_name;
    var contact_number = req.body.contact_number;
    var contact_info = req.body.contact_info;

    var contact = [];
    for(let i=0; i < contact_name.length; i++) {
      if(contact_name[i] !== "") {
        contact.push({
          name: contact_name[i],
          number: contact_number[i],
          info: contact_info[i]
        });
      }
    }
  }

  let site = new Site(id, name, acronym, number, address, airfilter, contact, checkpoints);
  site.editSite().then(result => {
    res.redirect('/sites/site/'+id);
  })
});

module.exports = router;