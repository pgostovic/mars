var log = require("phnq_log").create(__filename);
var phnq_core = require("phnq_core");
var config = require("../config");
var lastfm = require("phnq_lastfm");
var _ = require("underscore");

lastfm.setApiKey(config.lastFmApiKey);

exports.init = function(app)
{
	app.get("/api/autocomplete/:query", function(req, res)
	{
		var query = req.params["query"];

		lastfm.autocomplete(query, function(result)
		{
			var ac =
			{
				artists: [],
				albums: [],
				tracks: [],
				origDocs: result.response.docs
			};

			_.each(ac.origDocs, function(doc)
			{
				doc.image = "http://userserve-ak.last.fm/serve/64s/" + doc.image;

				switch(doc.restype)
				{
					case lastfm.RES_TYPE_ARTIST:
						ac.artists.push(doc);
						break;
					case lastfm.RES_TYPE_ALBUM:
						ac.albums.push(doc);
						break;
					case lastfm.RES_TYPE_TRACK:
						ac.tracks.push(doc);
						break;
				}
			});

			res.json(ac);
		});
	});

	app.get("/api/tracks/search/:query", function(req, res)
	{
		var query = req.params["query"];

		lastfm.trackSearch(query, function(result)
		{
			try
			{
				res.json(result.results.trackmatches.track);
			}
			catch(ex)
			{
				log.error("Error getting tracks for \""+query+"\"", ex), result;
				res.json([]);
			}
		});
	});
};
