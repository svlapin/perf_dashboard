'use strict';

var fs = require('fs');
var async = require('async');
var _ = require('lodash');

var dataFiles = [
  './data/mycs_com.json',
  './data/mycs_io.json'
];

/*
  GET /metrics
 */
exports.get = function(req, res) {
  async.waterfall(
    [
      readDataFiles,
      analyzeMetrics
    ],

    function(err, results) {
      if (err) {
        return res.status(500).send(err.message);
      }

      res.json(results);
    }
  );
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

/**
 * Analyzes passed metricsData and calls callback with the array
 * having the following structure:
 * [
 *   // site 1
 *   {
 *     metricsKey: {
 *       avg: 1234,
 *       max: 12345,
 *       min: 123
 *     }
 *   },
 *
 *   // site 2
 *   ...
 * ]
 *
 * @param  {Object}   results metrics data
 * @param  {Function} cb      callback
 */
function analyzeMetrics(results, cb) {
  var metrics = results.map(function(r) {
    return _.pluck(r.runs, 'metrics');
  });

  var analyzed = metrics.map(function(runs) {
    var metricsKeys = Object.keys(runs[0]);

    var result = {};

    metricsKeys.forEach(function(key) {
      var resultsForKey = _.pluck(runs, key);

      var sum = resultsForKey.reduce(function(a, b) {
        return a + parseInt(b, 10);
      }, 0);

      result[key] = {
        average: sum / runs.length,
        min: Math.min.apply(null, resultsForKey),
        max: Math.max.apply(null, resultsForKey)
      };
    });

    return result;
  });

  // since the code above is synchronous when the function is
  // written in asynchronous style, it is a good practise to execute
  // the callback in nextTick:
  process.nextTick(function() {
    cb(null, analyzed);
  });
}
