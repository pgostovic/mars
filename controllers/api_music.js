var log = require("phnq_log").create(__filename);
var phnq_core = require("phnq_core");
var config = require("../config");
var lastfm = require("phnq_lastfm");

lastfm.setApiKey(config.lastFmApiKey);

exports.init = function(app)
{
	app.get("/api/tracks/search/:query", function(req, res)
	{
		var query = req.params["query"];

		lastfm.trackSearch(query, function(result)
		{
			res.json(result.results.trackmatches.track);
		});
	});
};
