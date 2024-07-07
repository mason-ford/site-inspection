var express = require('express');
var moment = require('moment');
var router = express.Router();
var airFilterRouter = require ('./airfilterRouter');
var contactRouter = require ('./contactRouter');

const loginRequired = require('../middleware/loginRequired');
const Site = require('../domain/site');
const SiteContact = require('../domain/contact');
const SiteAirFilter = require('../domain/airFilter');
const Checkpoint = require('../domain/checkpoint');
const Inspection = require('../domain/inspection');
const Task = require('../domain/task');

const menuId = 'site';

router.use('/:siteId/airfilters', (req, res, next) => {
  req.siteId = req.params.siteId; // Pass the siteId to the airfilterRouter
  next();
}  , airFilterRouter);

router.use('/:siteId/contacts', (req, res, next) => {
  req.siteId = req.params.siteId; // Pass the siteId to the contactRouter
  next();
}  , contactRouter);

// GET ALL SITES
router.get('/', (req, res) => {
  console.log('Get all sites');

  Site.getAllSites()
    .then(sites => {
      res.render('sites/sites', {page:'Sites', menuId: menuId, sites: sites, moment: moment});
    })
    .catch(err => {
      console.error('Error getting sites:', err);
      res.status(500).send('Internal Server Error');
    });
});

// ADD PAGE
router.get('/add', (req, res) => {
  console.log('Add site page');

  res.render('sites/sites-add', {page: 'Add Site', menuId: menuId, checkpoints: false});
});

// GET SITE
router.get('/:siteId', (req, res) => {
  console.log('Get site ' + req.params.siteId);

  const siteId = req.params.siteId;
  let site, contacts, airFilters, tasks;

  //res.render('sites/sites-single', {moment: moment, page:'Site', menuId: menuId, site: site, moment: moment})

  Site.getSiteById(siteId)
    .then(siteData => {
      if (!siteData) {
        throw new Error('Site not found.');
      }
      site = siteData;
      console.log('Site:', site);

      return SiteContact.getAllContactsForSite(siteId);
    })
    .then(contactsData => {
      contacts = contactsData;
      console.log('Contacts:', contacts);

      return SiteAirFilter.getAllAirFiltersForSite(siteId);
    })
    .then(airFiltersData => {
      airFilters = airFiltersData;
      console.log('Air Filters:', airFilters);

      return Task.getUncompletedTasksForSite(siteId);
    })
    .then(taskData => {
      tasks = taskData;
      console.log('Tasks:', tasks);

      return Inspection.getAllInspectionsForSite(siteId);
    })
    .then(inspections => {
      console.log('Inspections:', inspections);

      // Pass all data to the rendering function
      res.render('sites/siteView', { moment: moment, page:'Site', menuId: menuId, site: site, contacts: contacts, airFilters: airFilters, inspections: inspections, tasks: tasks });
    })
    .catch(err => {
      console.error('Error:', err);
      res.status(500).send('Internal Server Error');
    });
});

// ADD SUBMIT
router.post('/add', loginRequired, (req, res) => {
  console.log('Add site');

  let name = req.body.site_name;
  let acronym = req.body.site_acronym;
  let number = req.body.site_number;
  let address = req.body.site_address;
  let lat = req.body.site_lat;
  let long = req.body.site_long;
  let standardKey = req.body.access_key_standard;
  let keyInstructions = req.body.access_key_instructions;
  let accessInstructions = req.body.access_instructions;

  const site = new Site(null, name, acronym, number, address, {x: long, y: lat}, standardKey, keyInstructions, accessInstructions);
  site.addSite()
    .then(newSiteId => {
      console.log('Redirect to /sites/'+newSiteId)
      res.redirect('/sites/'+newSiteId);
    })
    .catch(err => {
      console.error('Error adding site:', err);
      res.status(500).send('Internal Server Error');
    });
  
});

// EDIT PAGE
router.get('/edit/:siteId', (req, res) => {
  console.log('Update site page');

  const siteId = req.params.siteId;
  let site, contacts;

  Site.getSiteById(siteId)
    .then(siteData => {
      if (!siteData) {
        throw new Error('Site not found.');
      }
      site = siteData;
      console.log('Site:', site);

      return SiteContact.getAllContactsForSite(siteId);
    })
    .then(contactsData => {
      contacts = contactsData;
      console.log('Contacts:', contacts);

      return SiteAirFilter.getAllAirFiltersForSite(siteId);
    })
    .then(airFilters => {
      console.log('Air Filters:', airFilters);

      // Pass all data to the rendering function
      res.render('sites/sites-edit', { moment: moment, page:'Site', menuId: menuId, site: site, contacts: contacts, airFilters: airFilters });
    })
    .catch(err => {
      console.error('Error:', err);
      res.status(500).send('Internal Server Error');
    });
});

// EDIT SUBMIT AND DELETE
router.post('/edit/:siteId', loginRequired, (req, res) => {
  console.log('Edit site');

  let task = req.body.send;
  let siteId = req.params.siteId;

  if (task === "update") {
    let newName = req.body.site_name;
    let newAcronym = req.body.site_acronym;
    let newNumber = req.body.site_number;
    let newAddress = req.body.site_address;
    let newLat = req.body.site_lat;
    let newLong = req.body.site_long;
    let newStandardKey = req.body.access_key_standard;
    let newKeyInstructions = req.body.access_key_instructions;
    let newAccessInstructions = req.body.access_instructions;

    Site.editSite(siteId, newName, newAcronym, newNumber, newAddress, newLat, newLong, newStandardKey, newKeyInstructions, newAccessInstructions)
      .then(() => {
        console.log('Site edited successfully.');
        res.redirect('/sites/'+siteId);
      })
      .catch(err => {
        console.error('Error editing site:', err);
        res.status(500).send('Internal Server Error');
      });
  } else if (task == "delete") {
    Site.deleteSite(siteId)
    .then(() => {
      console.log('Site deleted successfully.');
      res.redirect('/sites');
    })
    .catch(err => {
      console.error('Error deleting site:', err);
      res.status(500).send('Internal Server Error');
    });
  }
});

module.exports = router;