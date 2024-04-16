require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
//const session = require('express-session');
//const flash = require('connect-flash');
//const msal = require('@azure/msal-node');

//var authRouter = require('./routes/auth'); 
var indexRouter = require('./routes/indexRouter');
var sitesRouter = require('./routes/siteRouter');
var checkpointsRouter = require('./routes/checkpointRouter');
var inspectionsRouter = require('./routes/inspectionRouter');
var tasksRouter = require('./routes/tasks');

/*
var licensesRouter = require('./routes/licenses');
var assetTypesRouter = require('./routes/asset-types');
var modelsRouter = require('./routes/models');
var agenciesRouter = require('./routes/agencies');
*/

var app = express();

// In-memory storage of logged-in users
// For demo purposes only, production apps should store
// this in a reliable storage
app.locals.users = {};

// MSAL config
/*const msalConfig = {
  auth: {
    clientId: process.env.OAUTH_APP_ID,
    authority: process.env.OAUTH_AUTHORITY,
    clientSecret: process.env.OAUTH_APP_SECRET
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message, containsPii) {
        //console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: msal.LogLevel.Verbose,
    }
  }
};

// Create msal application object
app.locals.msalClient = new msal.ConfidentialClientApplication(msalConfig);

// Session middleware
// NOTE: Uses default in-memory session store, which is not
// suitable for production
app.use(session({
  secret: '',
  resave: false,
  saveUninitialized: false,
  unset: 'destroy'
}));

// Flash middleware
app.use(flash());

// Set up local vars for template layout
app.use(function(req, res, next) {
  // Read any flashed errors and save
  // in the response locals
  res.locals.error = req.flash('error_msg');

  // Check for simple error string and
  // convert to layout's expected format
  var errs = req.flash('error');
  for (var i in errs){
    res.locals.error.push({message: 'An error occurred', debug: errs[i]});
  }

  // Check for an authenticated user and load
  // into response locals
  if (req.session.userId) {
    res.locals.user = app.locals.users[req.session.userId];
  }

  next();
});
*/

function loginRequired(req, res, next) {
  //if(process.env.PRODUCTION === 'false') {
    res.locals.user = {
      displayName: 'John Doe',
      email: 'jdoe@crest.ca'
    };
  //}

  if (!res.locals.user) {
    return res.redirect('/auth/signinPage');
  }

  next();
}

app.use(bodyParser.json()); // parse form data client
app.use(bodyParser.urlencoded({extended:true}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/auth', authRouter);
app.use(express.static(path.join(__dirname, 'private')), loginRequired);

//app.use('/', indexRouter);

app.get('/', loginRequired, indexRouter);
app.use('/sites', loginRequired, sitesRouter);
app.use('/checkpoints', loginRequired, checkpointsRouter);
app.use('/inspections', loginRequired, inspectionsRouter);
app.use('/tasks', loginRequired, tasksRouter);

// FUTURE
//app.use('/licenses', loginRequired, licensesRouter);
//app.use('/asset-type', loginRequired, assetTypesRouter);
//app.use('/model', loginRequired, modelsRouter);
//app.use('/agency', loginRequired, agenciesRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
