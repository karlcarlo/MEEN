var express = require('express');
var router_root = express.Router();
var router_users = express.Router();
// var router_products = express.Router();

var home_controller = require('./home_controller');
var users_controller = require('./users_controller');
// var products_controller = require('./products_controller');

module.exports = function(app){
  // home routers
  app.use('/', router_root);
  app.use('/users', router_users);
  // app.use('/products', router_products);

  /* GET home page. */
  router_root.get('/', home_controller.index);

  /* GET users listing. */
  router_users.get('/', users_controller.index);

  /* products */
  // router_products.get('/', products_controller.index);


};
