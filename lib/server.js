'use strict';

var fs = require('fs');

var express = require('express');
var app = express();
var logger = require('connect-logger');

var metrics = require('../controllers/metrics');

app.use(logger());

// routes
app.get('/metrics', metrics.get);

app.use(express.static(__dirname + '/../public'));

module.exports = app;
