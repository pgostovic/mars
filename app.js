// Dependencies
var _ = require("underscore");
var express = require('express');
var phnq_widgets = require("phnq_widgets");
var phnq_log = require("phnq_log");
var phnq_core = require("phnq_core");
var _path = require("path");
var fs = require("fs");
var config = require('./config');
var log = phnq_log.create(__filename);
var app = module.exports = express.createServer(phnq_widgets.widgetRenderer());
var mongoose = require("mongoose");

// Configuration
app.configure(function()
{
	app.use(express.bodyParser());
	app.use(express.cookieParser());
});

app.configure('development', function()
{
	phnq_log.setLevel("debug");
	phnq_widgets.config.jQueryCDN = false;
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

	if(process.argv[1].match("/mocha/"))
		phnq_core.extend(config, config.test);
	else
		phnq_core.extend(config, config.dev);
});

app.configure('production', function()
{
	phnq_log.setLevel("info");
	phnq_widgets.config.jQueryCDN = true;
	app.use(express.errorHandler());
	phnq_core.extend(config, config.prod);
});

mongoose.connect("mongodb://"+config.dbHost+"/"+config.dbName);

app.listen(8888, function()
{
	log.info("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

// Widgets
phnq_widgets.start({express: app, appRoot:__dirname});
