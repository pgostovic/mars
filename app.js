// Dependencies
var express = require('express');
var phnq_widgets = require("phnq_widgets");
var phnq_log = require("phnq_log");
var phnq_core = require("phnq_core");
var _path = require("path");
var fs = require("fs");
var config = require('./config');
var log = phnq_log.create(__filename);
var mongoose = require("mongoose");

var app = express();

// Configuration
app.configure(function()
{
	app.use(phnq_widgets.widgetRenderer());
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

var connStr = "mongodb://"+config.dbHost+"/"+config.dbName;
try
{
	mongoose.connect(connStr);
}
catch(ex)
{
	log.error("Error connecting to "+connStr, ex);
}

phnq_widgets.start({express: app, appRoot:__dirname});

app.listen(config.port, function()
{
	log.info("Express server listening on port %d in %s mode", config.port, app.settings.env);
});
