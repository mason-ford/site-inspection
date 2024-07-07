var express = require('express');
var moment = require('moment');
var router = express.Router();
const path = require('path');
const fs = require('fs');
const pdfmake = require('pdfmake');
const { Readable } = require('stream'); // Import the Readable class
const Site = require('../domain/site');
const Inspection = require('../domain/inspection');
const Task = require('../domain/task');

const fonts = {
  Roboto: {
    normal: path.resolve('public', 'fonts', 'Roboto', 'Roboto-Regular.ttf'),
    bold: path.resolve('public', 'fonts', 'Roboto', 'Roboto-Bold.ttf'),
  }
}

const menuId = 'report';

router.get('/', async (req, res) => {
  res.render('reports/reportView', {
    page: 'Reports',
    menuId: menuId,
  });
});

// Route to handle report generation
router.post('/', async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    // Fetch inspection data from the database
    const inspections = await Inspection.getInspectionsWithinDateRangeForReport(startDate, endDate);

    // Fetch number of sites inspected
    const sitesInspected = await Inspection.countUniqueInspectedSites(startDate, endDate);

    // Fetch task data from the database
    const tasks = await Task.getTasksWithinDateRange(startDate, endDate);

    // Fetch tasks created and completed count
    const tasksCount = await Task.countTasks(startDate, endDate);

    // Generate the PDF report
    const pdfDoc = await createPdfDocument(startDate, endDate, inspections, sitesInspected, tasks, tasksCount);

    // Send the PDF file as a download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');
    pdfDoc.pipe(res);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF');
  }
});

async function createPdfDocument(startDate, endDate, inspections, sitesInspected, tasks, tasksCount) {
  return new Promise((resolve, reject) => {
    try {
      // Define inspection table headers
      const tableHeadersInspection = [
        '#',
        'Site',
        'Date',
        'Inspector',
        'Pass',
        'Fail',
        'Action',
      ];

      // Define inspection table body rows
      const tableBodyInspection = inspections.map((inspection, index) => [
        (index+1),
        `(${inspection.siteNumber} ${inspection.siteAcronym}) ${inspection.siteName}`,
        moment(inspection.dateTime).format('YYYY-MM-DD'),
        inspection.userName,
        inspection.passCount.toString(),
        inspection.failCount.toString(),
        inspection.actionCount.toString(),
      ]);

      // Define Task table headers
      const tableHeadersTask = [
        '#',
        'Name',
        'Site',
        'Created',
        'Created By',
        'Completed',
        'Completed By',
      ];

      // Define Task table body rows
      const tableBodyTask = tasks.map((task, index) => [
        (index+1),
        task.name,
        `(${task.site.number} ${task.site.acronym}) ${task.site.name}`,
        moment(task.dateCreated).format('YYYY-MM-DD') || '',
        task.createdByUserId,
        task.dateCompleted ? moment(task.dateCompleted).format('YYYY-MM-DD') : 'Incomplete',
        task.completedByUserId,
      ]);

      // Create PDF document definition
      const documentDefinition = {
        content: [
          { text: 'Site Inspection Report', style: 'header', alignment: 'center' },
          { text: `Report Start: ${moment(startDate).format('YYYY-MM-DD')}`, style: 'subheader' },
          { text: `Report End: ${moment(endDate).format('YYYY-MM-DD')}`, style: 'subheader' },
          { text: `\Sites Inspected: ${sitesInspected.toString()}`, style: 'subheader' },
          { text: `Inspections: ${inspections.length.toString()}`, style: 'subheader' },
          { text: `\nTasks Created: ${tasksCount.totalTasks.toString()}`, style: 'subheader' },
          { text: `Tasks Completed: ${tasksCount.completedTasks.toString()}`, style: 'subheader' },
          { text: '\nInspection Summary', style: 'subheader' },
          {
            style: 'table',
            table: {
              headerRows: 1,
              widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
              body: [tableHeadersInspection, ...tableBodyInspection]
            }
          },
          { text: '\Task Summary', style: 'subheader' },
          {
            style: 'table',
            table: {
              headerRows: 1,
              widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
              body: [tableHeadersTask, ...tableBodyTask]
            }
          }
        ],
        styles: {
          header: {
            fontSize: 18,
            margin: [0, 0, 0, 10],
            bold: true
          },
          subheader: {
            fontSize: 14,
            margin: [0, 0, 0, 5]
          },
          summary: {
            fontSize: 12,
            margin: [0, 0, 0, 10]
          },
          table: {
            margin: [0, 5, 0, 15]
          }
        }
      };

      // Create PDF
      const printer = new pdfmake(fonts);
      const pdfDoc = printer.createPdfKitDocument(documentDefinition);
      pdfDoc.end();
      resolve(pdfDoc);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = router;
