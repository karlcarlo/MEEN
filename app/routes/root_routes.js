var express = require('express');
var router = express.Router();
var home_controller = require('../controllers/home_controller');

module.exports = function(app){
  // routers
  app.use('/', router);

  /* GET index page. */
  router.get('/', home_controller.index);

};
