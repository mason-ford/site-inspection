var express = require('express');
var moment = require('moment');
var router = express.Router();

const loginRequired = require('../middleware/loginRequired');
const Checkpoint = require('../domain/checkpoint.js');

const menuId = 'checkpoint';

// Route to get all checkpoints
router.get('/', (req, res) => {
  console.log('Route to get all checkpoints');

  Checkpoint.getAllCheckpoints()
    .then(checkpoints => {
      res.render('checkpoints/checkpointsView', { page:'Checkpoints', menuId: menuId, checkpoints: checkpoints });
    })
    .catch(err => {
      console.log(err);
      res.status(500).send('Internal Server Error');
    });
});

// Route to render add checkpoint page
router.get('/add', (req, res) => {
  console.log('Route to render add checkpoint page');

  res.render('checkpoints/checkpointAddView', { page:'Add Checkpoint', menuId: menuId });
});

// Route to add a new checkpoint
router.post('/add', loginRequired, (req, res) => {
  console.log('Route to add a new checkpoint');

  const { name, information, passText, failText, actionText } = req.body;

  Checkpoint.addCheckpoint(name, information, passText, failText, actionText)
    .then(newCheckpointId => {
      res.redirect(req.baseUrl);
    })
    .catch(err => {
      res.status(500).send('Internal Server Error');
    });
});

// Route to get a checkpoint by ID
router.get('/:id', (req, res) => {
  console.log('Route to get a checkpoint by ID');

  const checkpointId = req.params.id;

  Checkpoint.getCheckpointById(checkpointId)
    .then(checkpoint => {
      if (checkpoint) {
        res.render('checkpoints/checkpointView', { page:'Checkpoints', menuId: menuId, checkpoint: checkpoint });
      } else {
        res.status(404).send('Checkpoint not found');
      }
    })
    .catch(err => {
      res.status(500).send('Internal Server Error');
    });
});

// Route to render edit checkpoint page
router.get('/:id/update', (req, res) => {
  console.log('Route to render update checkpoint page');

  const checkpointId = req.params.id;

  Checkpoint.getCheckpointById(checkpointId)
    .then(checkpoint => {
      if (checkpoint) {
        res.render('checkpoints/checkpointUpdateView', { page:'Edit Checkpoint', menuId: menuId, checkpoint: checkpoint });
      } else {
        res.status(404).send('Checkpoint not found');
      }
    })
    .catch(err => {
      res.status(500).send('Internal Server Error');
    });
});

// Route to update or delete checkpoint
router.post('/:id/update', loginRequired, (req, res) => {
  console.log('Route to update or delete checkpoint');

  const checkpointId = req.params.id;

  let task = req.body.send;

  if (task === "update") {

    const { name, information, passText, failText, actionText } = req.body;

    Checkpoint.updateCheckpoint(checkpointId, name, information, passText, failText, actionText)
      .then(() => {
        res.redirect(req.baseUrl);
      })
      .catch(err => {
        res.status(500).send('Internal Server Error');
      });

  } else if (task == "delete") {

    Checkpoint.deleteCheckpoint(checkpointId)
      .then(() => {
        res.redirect(req.baseUrl);
      })
      .catch(err => {
        res.status(500).send('Internal Server Error');
      });

  }
});

module.exports = router;
