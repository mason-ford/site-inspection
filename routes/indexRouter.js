var express = require('express');
var moment = require('moment');
var router = express.Router();
const Site = require('../domain/site');
const Inspection = require('../domain/inspection');

const menuId = 'home';

/* GET home page. */
router.get('/', (req, res) => {

  // Fetch latest inspections
  const latestInspectionAmount = 5; // Number of latest inspections to fetch
  Inspection.getLatestInspections(latestInspectionAmount)
    .then(latestInspections => {
      // Fetch all sites with newest inspection date
      Site.getAllSites()
        .then(sites => {
          // Iterate through each site to find the newest inspection date
          const promises = sites.map(site => {
            return site.getNewestInspectionDate()
              .then(newestInspectionDate => {
                site.newestInspection = newestInspectionDate;
                return site;
              });
          });

          // Wait for all promises to resolve
          Promise.all(promises)
            .then(sitesWithNewestInspection => {
              // Sort the array of sites by oldest inspection date
              sitesWithNewestInspection.sort((a, b) => {
                // If either of the sites has no inspection date, move it to the top
                if (!a.newestInspection) return -1;
                if (!b.newestInspection) return 1;
                // Compare the inspection dates
                return new Date(a.newestInspection) - new Date(b.newestInspection);
              });

              // Send response with sorted sites and latest inspections
              res.render('index', { moment: moment, page: 'Home', menuId: menuId, sites: sitesWithNewestInspection, inspections: latestInspections });
            })
            .catch(err => {
              console.error(err);
              res.status(500).send('Internal Server Error');
            });
        })
        .catch(err => {
          console.error(err);
          res.status(500).send('Internal Server Error');
        });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });

});

module.exports = router;
