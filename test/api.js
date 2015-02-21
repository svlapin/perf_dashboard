'use strict';

var request = require('supertest');
var assert = require('assert');

var app = require('../lib/server');

describe('/metrics', function() {
  var requestObject;

  beforeEach(function() {
    requestObject = request(app).get('/metrics');
  });

  it('should respond with json', function(done) {
    requestObject
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('result should be array of two objects', function(done) {
    requestObject
      .expect(200, function(err, res) {
        if (err) return done(err);

        assert.equal(res.body.length, 2);
        done();
      });
  });

  it('each metric should have min, max and average numbers', function(done) {
    requestObject
      .expect(200, function(err, res) {
        if (err) return done(err);

        res.body.forEach(function(siteResult) {
          for (var metric in siteResult) {
            assert.equal(typeof siteResult[metric].max, 'number',
              'Result for max of "' + metric + '" is not a number');
            assert.equal(typeof siteResult[metric].min, 'number',
              'Result for min of "' + metric + '" is not a number');
            assert.equal(typeof siteResult[metric].average, 'number',
              'Result for average of "' + metric + '" is not a number');
          }
        });

        done();
      });
  });

  it('each metric should have average between its min and max',
    function(done) {
    requestObject
      .expect(200, function(err, res) {
        if (err) return done(err);

        res.body.forEach(function(siteResult) {
          for (var metric in siteResult) {
            assert(siteResult[metric].average <= siteResult[metric].max &&
              siteResult[metric].average >= siteResult[metric].min);
          }
        });

        done();
      });
  });
});
