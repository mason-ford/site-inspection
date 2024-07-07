var express = require('express');
var moment = require('moment');
var router = express.Router();
const Site = require('../domain/site');
const Inspection = require('../domain/inspection');
const InspectionCheckpoint = require('../domain/inspectionCheckpoint');
const Task = require('../domain/task');

const menuId = 'home';

/* GET home page. */
router.get('/', async (req, res) => {
  try {

    // Latest Inspections
    const latestInspectionAmount = 10;
    const latestInspections = await Inspection.getLatestInspections(latestInspectionAmount);

    const sites = await Site.getAllSites();
    const promises = sites.map(async (site) => {
      const newestInspectionDate = await site.getNewestInspectionDate();
      site.newestInspection = newestInspectionDate;
      return site;
    });

    // Sites with oldest inspections
    let sitesWithNewestInspection = await Promise.all(promises);

    sitesWithNewestInspection.sort((a, b) => {
      if (!a.newestInspection) return -1;
      if (!b.newestInspection) return 1;
      return new Date(a.newestInspection) - new Date(b.newestInspection);
    });

    const oldestInspectionAmount = 10;
    const sitesWithOldestInspection = sitesWithNewestInspection.slice(0, oldestInspectionAmount);

    // Failed checkpoints
    const failedInspectionCheckpoints = await InspectionCheckpoint.getFailedInspectionCheckpointsForSites();

    // Pending tasks
    const pendingTasks = await Task.getAllUncompletedTasks();

    res.render('index', {
      moment: moment,
      page: 'Home',
      menuId: menuId,
      sites: sitesWithOldestInspection,
      inspections: latestInspections,
      failedInspectionCheckpoints: failedInspectionCheckpoints,
      pendingTasks: pendingTasks
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
