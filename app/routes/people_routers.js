var express = require('express');
var router = express.Router();
var controller = require('../controllers/people_controller');

module.exports = function(app){
  // routers
  app.use('/people', router);

  /* GET index page. */
  router.get('/', controller.index);

};
