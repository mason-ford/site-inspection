var express = require('express');
var moment = require('moment');
var router = express.Router();

const loginRequired = require('../middleware/loginRequired');
const AirFilter = require('../domain/airFilter');
const Site = require('../domain/site');

const menuId = 'site';

// Get air filters by site id
router.get('/', (req, res) => {
  console.log('Get airfilters for site');

  let siteId = req.siteId;
  let site;

  Site.getSiteById(siteId)
    .then(siteData => {
      if (!siteData) {
        throw new Error('Site not found.');
      }
      site = siteData;
      console.log('Site:', site);

      return AirFilter.getAllAirFiltersForSite(siteId);
    })
    .then(airFilters => {
      console.log('Air Filters:', airFilters);

      // Pass all data to the rendering function
      res.render('sites/airfilterView', { moment: moment, page:'Air Filters', menuId: menuId, airFilters: airFilters, site: site });
    })
    .catch(err => {
      console.error('Error:', err);
      // Handle error
    });
})

// Add air filter page
router.get('/add', (req, res) => {
  console.log('Add airfilter page');

  res.render('sites/airfilterAddView', { page: 'Add Air Filter', menuId: menuId });
});

// Add air filter
router.post('/add', loginRequired, (req, res) => {
  console.log('Add air filter');

  let siteId = req.siteId;
  let type = req.body.type;
  let size = req.body.size;
  let quantity = req.body.quantity;
  let information = req.body.information;

  AirFilter.addAirFilter(siteId, type, size, quantity, information)
    .then(newAirFilterId => {
      console.log('New air filter added with ID:', newAirFilterId);
      res.redirect(req.baseUrl);
    })
    .catch(err => {
      console.error('Error adding contact:', err);
      res.status(500).send(err);
    });
});

// Update air filter page
router.get('/edit/:airFilterId', (req, res) => {
  console.log('Update air filter page');

  const airFilterId = req.params.airFilterId;

  AirFilter.getAirFilter(airFilterId)
    .then(airFilter => {
      if(!airFilter) {
        throw new Error('Air filter not found.');
      }

      res.render('sites/airfilterUpdateView', { moment: moment, page:'Air Filter Update', menuId: menuId, airFilter: airFilter});
    })
    .catch(err => {
      console.error('Error:', err);
      res.status(500).send(err);
    });
});

// Update or delete air filter
router.post('/edit/:airFilterId', loginRequired, (req, res) => {
  console.log('Update or delete air filter');

  let task = req.body.send;
  let airFilterId = req.params.airFilterId;

  if (task === "update") {

    let type = req.body.type;
    let size = req.body.size;
    let quantity = req.body.quantity;
    let information = req.body.information;

    AirFilter.updateAirFilter(airFilterId, type, size, quantity, information)
      .then(() => {
        console.log('Air filter updated successfully.');
        res.redirect(req.baseUrl);
      })
      .catch(err => {
        console.error('Error updating air filter:', err);
        res.status(500).send(err);
      });

  } else if (task == "delete") {

    AirFilter.deleteAirFilter(airFilterId)
      .then(() => {
        console.log('Air Filter deleted successfully');
        res.redirect(req.baseUrl);
      })
      .catch(err => {
        console.error('Error deleting air filter:', err);
        res.status(500).send(err);
      });

  }
});

module.exports = router;