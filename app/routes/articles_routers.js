var express = require('express');
var router = express.Router();
var controller = require('../controllers/articles_controller');

module.exports = function(app){
  // routers
  app.use('/articles', router);

  /* GET index page. */
  router.get('/', controller.index);

};
