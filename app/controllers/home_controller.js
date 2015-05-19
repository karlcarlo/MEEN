'use strict';

var _ = require('lodash');
var async = require('async');

var helpers = require('../helpers');


exports.index = function(req, res, next) {
  res.render('home/index', { title: 'shop home' });
};
