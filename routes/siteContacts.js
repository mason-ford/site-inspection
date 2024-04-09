var express = require('express');
var router = express.Router();
const SiteContact = require('../domain/SiteContact');

const menuId = 'site';

// Test page
router.get('/', (req, res) => {
  res.send('Contacts');
})

// Add a contact
router.post('/', (req, res) => {
  console.log('Add contact');

  let siteId = req.body.siteId;
  let name = req.body.name;
  let number = req.body.number;
  let email = req.body.email;
  let information = req.body.information;

  SiteContact.addContact(siteId, name, number, email, information)
    .then(newContactId => {
      console.log('New contact added with ID:', newContactId);
      res.status(201).json({id: newContactId});
    })
    .catch(err => {
      console.error('Error adding contact:', err);
      res.status(500).send(err);
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