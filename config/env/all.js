'use strict';

var fs = require('fs');
var json_data = fs.readFileSync('./package.json');
var package_json = JSON.parse(json_data);

var path = require('path'),
rootPath = path.normalize(__dirname + '/../..');

module.exports = {
  version: package_json.version,
  root: rootPath,
  port: process.env.PORT || 3000,
  db: process.env.MONGOHQ_URL,
  app: {
    name: package_json.name,
    title: 'MEEN'
  }
};
