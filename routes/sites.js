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

  Site.getAllSites()
    .then(sites => {
      res.render('sites/sites', {page:'Sites', menuId: menuId, sites: sites, moment: moment});
    })
    .catch(err => {
      console.error('Error getting sites:', err);
    });
});

router.get('/site/:id', (req, res) => {
  console.log('Get site ' + req.params.id);

  let siteId = req.params.id;
  
  Site.getSite(siteId)
    .then(site => {
      if (site) {
        console.log('Site found:', site);
        res.render('sites/sites-single', {moment: moment, page:'Site', menuId: menuId, site: site, moment: moment})
      } else {
        console.log('Site not found.');
      }
    })
    .catch(err => {
      console.error('Error getting site:', err);
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

  const site = new Site(null, name, acronym, number, address, "", airfilter, contact, checkpoints);
  site.addSite()
    .then(newSiteId => {
      console.log('Redirect to /sites/site/'+newSiteId)
      res.redirect('/sites/site/'+newSiteId);
    })
    .catch(err => {
      console.err('Error adding site:', err);
    });
});

router.get('/edit/:id', (req, res) => {
  console.log('Update site page');

  let siteId = req.params.id;

  Site.getSite(siteId)
  .then(site => {
    if (site) {
      console.log('Site found:', site);
      res.render('sites/sites-edit', {moment: moment, page:'Site Edit', menuId: menuId, site: site})
    } else {
      console.log('Site not found.');
    }
  })
  .catch(err => {
    console.error('Error getting site:', err);
  });
});

router.post('/edit/:id', (req, res) => {
  console.log('Edit site');

  let task = req.body.send;
  let siteId = req.params.id;

  if (task == "update") {

    let newName = req.body.site_name;
    let newAcronym = req.body.site_acronym;
    let newNumber = req.body.site_number;
    let newAddress = req.body.site_address;
    //let newLatlong = req.body.site_latlong;

    Site.editSite(siteId, newName, newAcronym, newNumber, newAddress, "")
      .then(() => {
        console.log('Site edited successfully.');
        res.redirect('/sites/site/'+siteId);
      })
      .catch(err => {
        console.error('Error editing site:', err);
        res.redirect('/sites/site/'+siteId);
      });
  } else if (task == "delete") {
    Site.deleteSite(siteId)
    .then(() => {
      console.log('Site deleted successfully.');
      res.redirect('/sites');
    })
    .catch(err => {
      console.error('Error deleting site:', err);
      res.redirect('/sites/site/'+siteId);
    });
  }
});

module.exports = router;