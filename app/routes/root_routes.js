var express = require('express');
var router = express.Router();
var controller = require('../controllers/home_controller');

module.exports = function(app){
  // routers
  app.use('/', router);

  /* GET index page. */
  router.get('/', controller.index);

};
