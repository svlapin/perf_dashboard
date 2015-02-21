'use strict';

var fs = require('fs');
var async = require('async');

var dataFiles = [
  './data/mycs_com.json',
  './data/mycs_io.json'
];

/*
  GET /metrics
 */
exports.get = function(req, res) {
  readDataFiles(function(err, results) {
    if (err) {
      return res.status(500).send(err.message);
    }

    res.send('OK');
  });
};

/**
 * Reads and parses json files containing the metrics data
 * @param  {Function} cb callback executed with the optional error and
 *                       the array of objects with the parsed data
 */
function readDataFiles(cb) {
  // reading the files
  async.map(dataFiles, fs.readFile, function(err, results) {
    if (err) {
      return cb(new Error('Failed to read data files'));
    }

    var invalidJSON = false;

    var parsedData = results.map(function(f) {
      var parsedFile;
      try {
        parsedFile = JSON.parse(f);
      } catch (e) {
        invalidJSON = true;
      }

      return parsedFile;
    });

    if (invalidJSON) {
      return cb(new Error('Failed to parse data files'));
    }

    cb(null, parsedData);
  });
}
