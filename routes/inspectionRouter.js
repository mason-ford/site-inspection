var express = require('express');
var moment = require('moment');
var router = express.Router();
var multer = require('multer');

const Inspection = require('../domain/inspection');
const Site = require('../domain/site');
const Checkpoint = require('../domain/checkpoint');
const InspectionCheckpoint = require('../domain/inspectionCheckpoint');
const { check } = require('express-validator');

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

  Inspection.getAllInspections()
    .then(inspections => {
      res.render('inspections/inspectionsView', { page: 'Inspections', menuId: menuId, inspections: inspections, moment: moment });
    })
    .catch(err => {
      console.error('Error:', err);
      res.status(500).send('Internal Server Error');
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

      res.render('inspections/inspectionAddView', { page: 'New Inspection', menuId: menuId, moment: moment, sites: sites, checkpoints: checkpoints })
    })
    .catch(err => {
      console.error('Error:', err);
      res.status(500).send('Internal Server Error');
    })
});

router.get('/:id', (req, res) => {
  console.log('Get inspection ' + req.params.id);

  let id = req.params.id;
  let inspection, site;

  Inspection.getInspectionById(id)
    .then(inspectionData => {
      console.log(inspectionData);
      inspection = inspectionData;

      return Site.getSiteById(inspectionData.siteId);
    })
    .then(siteData => {
      console.log(siteData);
      site = siteData
      
      return InspectionCheckpoint.getAllInspectionCheckpointsForInspection(inspection.id);
    })
    .then(icData => {
      console.log(icData);

      res.render('inspections/inspectionView', { page: 'Inspection', menuId: menuId, moment: moment, inspection: inspection, site: site, checkpoints: icData })
    })
    .catch(err => {
      console.error('Error:', err);
      res.status(500).send('Internal Server Error');
    });
});

// Route to render update inspection page
router.get('/:id/update', (req, res) => {
  console.log('Route to render update inspection page');

  const inspectionId = req.params.id;
  let inspection, site;

  Inspection.getInspectionById(inspectionId)
    .then(inspectionData => {
      if (!inspectionData) {
        throw new Error('Inspection not found.');
      }
      console.log(inspectionData);
      inspection = inspectionData;

      return Site.getSiteById(inspectionData.siteId);
    })
    .then(siteData => {
      console.log(siteData);
      site = siteData
      
      return InspectionCheckpoint.getAllInspectionCheckpointsForInspection(inspection.id);
    })
    .then(icData => {
      console.log(icData);

      res.render('inspections/inspectionUpdateView', { page: 'Inspection', menuId: menuId, moment: moment, inspection: inspection, site: site, checkpoints: icData })
    })
    .catch(err => {
      console.error('Error:', err);
      res.status(500).send('Internal Server Error');
    });
});

router.post('/add', (req, res) => {
  console.log('Add inspection page');

  const { site, dateTime, information, userName, userId, checkpoints } = req.body;

  Inspection.addInspection(site, dateTime, information, userName, userId, checkpoints)
    .then(newInspectionId => {
      res.redirect(req.baseUrl +"/" + newInspectionId);
    })
    .catch(err => {
      console.error('Error:', err);
      res.status(500).send('Internal Server Error');
    });
});

// Route to update or delete inspection
router.post('/:id/update', (req, res) => {
  console.log('Route to update or delete inspection');

  const inspectionId = req.params.id;

  let task = req.body.send;

  if (task === "update") {

    const { information, checkpoints } = req.body;

    Inspection.updateInspection(inspectionId, information, checkpoints)
      .then(() => {
        res.redirect('./');
      })
      .catch(err => {
        cconsole.error('Error:', err);
        res.status(500).send('Internal Server Error');
      });

  } else if (task == "delete") {

    Inspection.deleteInspection(inspectionId)
      .then(() => {
        res.redirect(req.baseUrl);
      })
      .catch(err => {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
      });

  }
});

module.exports = router;