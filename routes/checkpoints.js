var express = require('express');
var router = express.Router();
const Checkpoint = require('../domain/checkpoint.js');

const menuId = 'checkpoint';

router.get('/', (req, res) => {
  console.log('Get all checkpoints');

  Checkpoint.getAllCheckpoints().then(checkpoints => {
    res.render('checkpoints/checkpoints', {page:'Checkpoints', menuId: menuId, checkpoints: checkpoints});
  });
});

router.get('/checkpoint/:id', (req, res) => {
  console.log('Get checkpoint ' + req.params.id);

  let id = req.params.id;
  Checkpoint.getCheckpoint(id).then(checkpoint => {
    res.render('checkpoints/checkpoints-single', {page:'Checkpoint', menuId: menuId, checkpoint: checkpoint})
  });
});

router.get('/add', (req, res) => {
  console.log('Add checkpoint page');

  res.render('checkpoints/checkpoints-add', {page: 'Add Checkpoint', menuId: menuId})
});

router.post('/add', (req, res) => {
  console.log('Add checkpoint');

  let name = req.body.checkpoint_name;
  let textValues = {
    good: req.body.checkpoint_good,
    attention: req.body.checkpoint_attention,
  }
  let description = req.body.checkpoint_description;
  
  let checkpoint = new Checkpoint(null, name, textValues, description);
  checkpoint.addCheckpoint().then(id => {
    res.redirect('/checkpoints/checkpoint/'+id);
  });
});

router.get('/edit/:id', (req, res) => {
  console.log('Edit checkpoint page');

  let id = req.params.id;
  Checkpoint.getCheckpoint(id).then(checkpoint => {
    res.render('checkpoints/checkpoints-edit', {page:'Checkpoint Edit', menuId: menuId, checkpoint: checkpoint});
  });
});

router.post('/edit/:id', (req, res) => {
  console.log('Edit checkpoint');

  let id = req.params.id;
  let name = req.body.checkpoint_name;
  let textValues = {
    good: req.body.checkpoint_good,
    attention: req.body.checkpoint_attention,
  }
  let description = req.body.checkpoint_description;
  
  let checkpoint = new Checkpoint(id, name, textValues, description);
  checkpoint.editCheckpoint().then(result => {
    res.redirect('/checkpoints/checkpoint/'+id);
  })
});

module.exports = router;
