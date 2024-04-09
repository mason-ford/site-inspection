var express = require('express');
var moment = require('moment');
var router = express.Router();
const Site = require('../domain/site');
const AirFilter = require('../domain/airFilter');

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
router.post('/add', (req, res) => {
  console.log('Add air filter');

  let siteId = req.siteId;
  let type = req.body.type;
  let quantity = req.body.quantity;
  let size = req.body.size;
  let information = req.body.information;

  AirFilter.addAirFilter(siteId, type, quantity, size, information)
    .then(newAirFilterId => {
      console.log('New air filter added with ID:', newAirFilterId);
      res.redirect('/sites/'+siteId+'/airfilters');
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

      res.render('sites/airfilterEditView', { moment: moment, page:'Air Filter Edit', menuId: menuId, airFilter: airFilter});
    })
    .catch(err => {
      console.error('Error:', err);
      // Handle error
    });
});

// Update a contact
router.put('/:id', (req, res) => {
  console.log('Update contact');

  let contactId = req.params.id;

  let name = req.body.name;
  let number = req.body.number;
  let email = req.body.email;
  let information = req.body.information;

  SiteContact.updateContact(contactId, name, number, email, information)
    .then(() => {
      console.log('Contact updated successfully.');
      res.sendStatus(200);
    })
    .catch(err => {
      console.error('Error updating contact:', err);
      res.status(500).send(err);
    });
});

// Delete a contact
router.delete('/:id', (req, res) => {
  console.log('Delete contact');

  let contactId = req.params.id;

  SiteContact.deleteContact(contactId)
    .then(() => {
      console.log('Contact deleted successfully.');
      res.sendStatus(200);
    })
    .catch(err => {
      console.error('Error deleting contact:', err);
      res.status(500).send(err);
    });
})

module.exports = router;