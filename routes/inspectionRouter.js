var express = require('express');
var moment = require('moment');
var router = express.Router();
var multer  = require('multer');

const Inspection = require('../domain/inspection');
const Site = require('../domain/site');
const Checkpoint = require('../domain/checkpoint');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './private/uploads/photos')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + Math.round(Math.random() * 1E9)
    //cb(null, file.fieldname + '-' + uniqueSuffix)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
})
var upload = multer({ storage: storage })

const menuId = 'inspection';

router.get('/', (req, res) => {
  console.log('Get all inspections');

  Inspection.getAllInspections().then(inspections => {
    res.render('inspections/inspectionsView', {page:'Inspections', menuId: menuId, inspections: inspections, moment: moment});
  });
});

router.get('/inspection/:id', (req, res) => {
  console.log('Get inspection ' + req.params.id);

  let id = req.params.id;
  Inspection.getInspection(id).then(inspection => {
    res.render('inspections/inspections-single', {page:'Inspection', menuId: menuId, inspection: inspection})
  });
});

router.get('/add', (req, res) => {
  console.log('Add inspection');

  let sites;

  Site.getAllSites()
    .then(sitesData => {
      sites = sitesData;

      return Checkpoint.getAllCheckpoints();
    })
    .then(checkpoints => {

      res.render('inspections/inspectionAddView', { page: 'New Inspection', menuId: menuId, sites: sites, checkpoints: checkpoints })
    })
    .catch(err => {
      console.error('Error:', err);
      res.status(500).send('Internal Server Error');
    })
});

router.post('/add', (req, res) => {
  console.log('Add inspection page');

  let siteId = req.body.inspection_siteId;

  Site.getSite(siteId).then(site => {
    console.log(site.id);
    res.render('inspections/inspections-add', {page: 'Inspection', menuId: menuId, site: site});
  });
});

router.post('/addInspection', upload.any(), (req, res) => {
  console.log('Add inspection');
  console.log(req.body);
  console.log(req.files);

  let date = new Date(Date.now());
  let user = req.body.inspection_user;
  let siteId = req.body.inspection_site;
  let checkpoints = req.body.inspection_checkpoints;

  if(req.files.length > 0) {
    checkpoints.forEach(checkpoint => {
      req.files.forEach(file => {
        if(checkpoint.id === file.fieldname) {
          checkpoint.photo = file.filename;
        };
      });
    });
  }

  let inspection = new Inspection(null, date, siteId, user, checkpoints);
  inspection.addInspection().then(id => {
    res.redirect('/inspections/inspection/'+id);
  });
});

module.exports = router;