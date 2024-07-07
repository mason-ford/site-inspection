var express = require('express');
var moment = require('moment');
var router = express.Router();

const loginRequired = require('../middleware/loginRequired');
const Contact = require('../domain/contact');
const Site = require('../domain/site');

const menuId = 'site';

// Test page
router.get('/', (req, res) => {
  console.log('Get contacts for site');

  let siteId = req.siteId;
  let site;

  Site.getSiteById(siteId)
    .then(siteData => {
      if (!siteData) {
        throw new Error('Site not found.');
      }
      site = siteData;
      console.log('Site:', site);

      return Contact.getAllContactsForSite(siteId);
    })
    .then(contacts => {
      console.log('Contacts:', contacts);

      // Pass all data to the rendering function
      res.render('sites/contactView', { moment: moment, page:'Contacts', menuId: menuId, contacts: contacts, site: site });
    })
    .catch(err => {
      console.error('Error:', err);
      // Handle error
    });
})

// Add contact page
router.get('/add', (req, res) => {
  console.log('Add contact page');

  res.render('sites/contactAddView', { page: 'Add Contact', menuId: menuId });
});

// Add a contact
router.post('/add', loginRequired, (req, res) => {
  console.log('Add contact');

  let siteId = req.siteId;
  let name = req.body.name;
  let number = req.body.number;
  let email = req.body.email;
  let information = req.body.information;

  Contact.addContact(siteId, name, number, email, information)
    .then(newContactId => {
      console.log('New contact added with ID:', newContactId);
      res.redirect(req.baseUrl);
    })
    .catch(err => {
      console.error('Error adding contact:', err);
      res.status(500).send(err);
    });
});

// Update contact page
router.get('/edit/:contactId', (req, res) => {
  console.log('Update contact page');

  const contactId = req.params.contactId;

  Contact.getContact(contactId)
    .then(contact => {
      if(!contact) {
        throw new Error('Contact not found.');
      }

      console.log(contact);
      res.render('sites/contactUpdateView', { moment: moment, page:'Contact Update', menuId: menuId, contact: contact});
    })
    .catch(err => {
      console.error('Error:', err);
      res.status(500).send(err);
    });
});

// Update or delete contact
router.post('/edit/:contactId', loginRequired, (req, res) => {
  console.log('Update or delete contact');

  let task = req.body.send;
  let contactId = req.params.contactId;

  if (task === "update") {

    let name = req.body.name;
    let number = req.body.number;
    let email = req.body.email;
    let information = req.body.information;

    Contact.updateContact(contactId, name, number, email, information)
      .then(() => {
        console.log('Contact updated successfully.');
        res.redirect(req.baseUrl);
      })
      .catch(err => {
        console.error('Error updating contact:', err);
        res.status(500).send(err);
      });
    
  } else if (task === "delete") {
    
    Contact.deleteContact(contactId)
      .then(() => {
        console.log('Contact deleted successfully');
        res.redirect(req.baseUrl);
      })
      .catch(err => {
        console.error('Error deleting contact:', err);
        res.status(500).send(err);
      })

  }
});

module.exports = router;