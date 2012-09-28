var log = require("phnq_log").create(__filename);
var phnq_core = require("phnq_core");
var config = require("../config");
var User = require("../model/User");

exports.init = function(app)
{
	// All users
	app.get("/api/users", function(req, res)
	{
		User.find(function(err, users)
		{
			res.json(users);
		});
	});

	// User by id
	app.get(new RegExp("/api/users/([^/]*)$"), function(req, res)
	{
		var id = req.params[0];
		getUser(id, req, res, function(user)
		{
			if(user)
				res.json(user);
			else
				res.send(404);
		});
	});

	// Part of a user by id and js path
	app.get(new RegExp("/api/users/([^/]*)/(.*)"), function(req, res)
	{
		var id = req.params[0];
		getUser(id, req, res, function(user)
		{
			if(!user)
				return res.send(404);

			var val = phnq_core.jsPath(user, req.params[1]);
			if(val != undefined)
				res.json(val);
			else
				res.send(404);
		});
	});

	// Set part of a user by id and js path
	app.put(new RegExp("/api/users/([^/]*)/(.*)"), function(req, res)
	{
		var id = req.params[0];
		getUser(id, req, res, function(user)
		{
			if(!user)
				return res.send(404);

			var val = phnq_core.jsPath(user, req.params[1], req.body);
			if(val != undefined)
			{
				user.save(function(err)
				{
					if(err)
						res.send(500);
					else
						res.json(val);
				});
			}
			else
			{
				res.send(404);
			}
		});
	});
};

/*
*	This function retrieves a user by id and passes user as the first
*	argument to the supplied callback fn.  If the specified id is the
*	"current user alias", by default configured as "me", then the request
*	cookied "id" is used as the id.  In this case, if there is no id
*	cookie or there is no user in the db that matches the id cookie, then
*	a new anonymous user is created and the newly created user's id is
*	added to a response cookie.
*/
var getUser = function(id, req, res, fn)
{
	var isMe = (id == config.currenUserAlias);
	if(isMe)
		id = req.cookies.id;

	if(id)
	{
		User.findById(id, function(err, user)
		{
			if(user)
				fn(user);
			else if(isMe)
				getUser(null, req, res, fn);
			else
				fn(null);
		});
	}
	else
	{
		var user = new User({isAnonymous:true, name:""});
		user.save(function(err)
		{
			if(err)
				return fn(null);

			res.cookie("id", user.id, { maxAge: config.anonUserIdCookieAge });
			fn(user);
		});
	}
};
