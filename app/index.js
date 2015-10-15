var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var _ = require('lodash');
var hbs = require('hbs');
var helmet = require('helmet');
var sass = require('node-sass-middleware');

var config = require('../config');
var helpers = require('./helpers');

var app = express();

// Global values
_.extend(app.locals, {
  version: config.version,
  title: config.app.title,
  description: config.app.description,
  keywords: config.app.keywords,
  messages: [],
  isDevelopment: process.env.NODE_ENV === 'development'
});

// handlebars
hbs.registerPartials(__dirname + '/views/partials');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('view options', {
  layout: 'layouts/default'
});

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

//Don't use logger for test env
if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}

// livereload
if(process.env.NODE_ENV === 'development'){
  app.locals.isDevelopment = true;
  app.use(function(req, res, next){
    app.locals.hostname = req.hostname;
    next();
  });
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sass({
  /* Options */
  src: path.join(__dirname, '../public'),
  dest: path.join(__dirname, '../public'),
  debug: false,
  outputStyle: 'nested', // nested, expanded, compact, compressed
  prefix:  ''  // Where prefix is at <link rel="styles" href="prefix/style.css"/>
}));
app.use(express.static(path.join(__dirname, '../public')));

// Use helmet to secure Express headers
app.use(helmet.xframe());
app.use(helmet.xssFilter());
app.use(helmet.nosniff());
app.use(helmet.ienoopen());
app.disable('x-powered-by');

// Globbing model files
helpers.getGlobbedFiles('./app/models/**/*.js').forEach(function(modelPath) {
  require(path.resolve(modelPath));
});

// Globbing routing files
helpers.getGlobbedFiles('./app/routes/**/*.js').forEach(function(routePath) {
  require(path.resolve(routePath))(app);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(err.status);
  res.render('errors/404.hbs', {
    message: err.message
  });
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('errors/500.hbs', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('errors/500.hbs', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
