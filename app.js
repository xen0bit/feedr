var express = require('express');
var app = express();
var server = require('http').Server(app);
var path = require('path');
var logger = require('morgan');
var fs = require('fs');

var api = require('./routes/api.js');

//var app = express();
app.set('trust proxy', true);
//app.use(compression())
app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());

app.use('/', api);
app.use(express.static(path.join(__dirname, 'public'), {
    maxage: '0h'
}));

module.exports = { app: app, server: server };
