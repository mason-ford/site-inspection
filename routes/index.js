var express = require('express');
var moment = require('moment');
var router = express.Router();
const Site = require('../domain/site');

const menuId = 'home';

/* GET home page. */
router.get('/', (req, res) => {

  var needsAttention = [];
  var oldestInspection = [];

  Site.getAllSitesWithInfo().then(sites => {
    sites.forEach(site => {
      // Find last time each checkpoint was checked
      site.findLastTimeCheckpointsChecked();

      // Find checkpoints that need attention
      site.checkpoints.forEach(checkpoint => {
        if(checkpoint.lastTime.value === 0) {
          needsAttention.push({
            siteId: site.id,
            siteName: site.name,
            checkpoint: checkpoint.name,
            date: checkpoint.lastTime.date
          });
        }
      });

      // Find the oldest inspection
      site.findOldestInspection();
      if(site.oldestInspection) {
        oldestInspection.push({
          siteId: site.id,
          siteName: site.name,
          date: site.oldestInspection.date
        });
      } else {
        oldestInspection.push({
          siteId: site.id,
          siteName: site.name,
          date: 0
        });
      }
    });
    
    return sites;
  }).then(sites => {
    // Sort Needs Attention by Site Name
    needsAttention.sort((a, b) => {
      var nameA = a.siteName.toUpperCase();
      var nameB = b.siteName.toUpperCase();
      return (nameA > nameB ? 1 : -1);
    });

    // Sort Last Inspection
    oldestInspection.sort((a, b) => {
      return (a.date - b.date);
    });
    res.render('index', {moment: moment, page:'Home', menuId: menuId, oldestInspection: oldestInspection, needsAttention: needsAttention});
  }).catch(e => {
    res.render(`Error ${e}`);
  });

});

module.exports = router;
