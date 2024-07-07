var express = require('express');
var moment = require('moment');
var router = express.Router();
var multer = require('multer');
const AWS = require('aws-sdk');

const loginRequired = require('../middleware/loginRequired');
const Inspection = require('../domain/inspection');
const Site = require('../domain/site');
const Checkpoint = require('../domain/checkpoint');
const InspectionCheckpoint = require('../domain/inspectionCheckpoint');
const Photo = require('../domain/photo');
const { check } = require('express-validator');

/*
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
*/

// Configure Multer for file uploads 
const storage = multer.memoryStorage(); // Store files in memory (to be uploaded to S3)
const upload = multer({ storage: storage })

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.S3_REGION // Specify the region where your S3 bucket is located
});
const s3 = new AWS.S3();

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

router.post('/add', upload.any(), loginRequired, (req, res) => {
  console.log('Add inspection page');

  const { site, dateTime, information, userName, userId, checkpoints } = req.body;
  let inspectionId;

  // Add inspection information to the database
  Inspection.addInspection(site, dateTime, information, userName, userId, checkpoints)
    .then(newInspectionId => {
      inspectionId = newInspectionId;

      // Handle form data and uploaded files
      const filesByCheckpoint = {};

      // Group uploaded files by checkpoint ID
      req.files.forEach(file => {
        const checkpointId = file.fieldname.split('_')[1]; // Extract the checkpoint ID from the field name
        if (!filesByCheckpoint[checkpointId]) {
          filesByCheckpoint[checkpointId] = [];
        }
        filesByCheckpoint[checkpointId].push(file);
      });


      // Upload files for each checkpoint to AWS S3...
      const uploadPromises = [];
      const photoInsertPromises = [];
      for (const checkpointId in filesByCheckpoint) {
        const files = filesByCheckpoint[checkpointId];
        files.forEach((file, index) => {
          const originalFilename = file.originalname;
          const fileExtension = originalFilename.split('.').pop(); // Extract file extension
          const newFilename = `${checkpointId}-${index}.${fileExtension}`;
          const params = {
            Bucket: process.env.S3_BUCKET,
            Key: `${process.env.S3_PATH_INSPECTION}/${inspectionId}/${newFilename}`,
            Body: file.buffer
          };

          // Create a promise for uploading to AWS S3
          const uploadPromise = new Promise((resolve, reject) => {
            s3.upload(params, (err, data) => {
              if (err) {
                console.error(`Error uploading file for checkpoint ${checkpointId} to S3:`, err);
                reject(err);
              } else {
                console.log(`File uploaded successfully for checkpoint ${checkpointId} to S3:`, data.Location);
                resolve(data.Location); // Resolve with the S3 URL
              }
            });
          });

          uploadPromises.push(uploadPromise);

          // Create a promise for adding photo location to the database
          const photoInsertPromise = Photo.addPhoto(newFilename, inspectionId, null);
          photoInsertPromises.push(photoInsertPromise);
        });
      }

      // Wait for all uploads and database insertions to finish
      return Promise.all([...uploadPromises, ...photoInsertPromises]);
    })
    .then(() => {
      // All uploads and database insertions finished successfully
      console.log('All uploads and database insertions finished successfully');

      // Redirect to the inspection details page
      res.redirect(req.baseUrl + "/" + inspectionId);
    })
    .catch(err => {
      console.error('Error:', err);
      res.status(500).send('Internal Server Error');
    });

});

// Route to update or delete inspection
router.post('/:id/update', loginRequired, (req, res) => {
  console.log('Route to update or delete inspection');

  const inspectionId = req.params.id;

  let task = req.body.send;

  if (task === "update") {

    console.log(req.body);

    const { information, checkpoints } = req.body;
    console.log(checkpoints);

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