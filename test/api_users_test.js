var log = require("phnq_log").create(__filename);
var assert = require("assert");
var _path = require("path");
var app = require("../app");
var request = require("request");
var mongoose = require("mongoose");
var User = require("../model/User");

describe("api_users", function()
{
	var baseUrl = "http://localhost:8888";

	beforeEach(function(done)
	{
		mongoose.connection.collections.users.drop(function(err)
		{
			done();
		})
	});

	describe("GET /api/users/{ID}", function()
	{
		it("should return the correct user data", function(done)
		{
			var name = "Bubba"+new Date().getTime();
			var u = new User({name:name});
			u.save(function(err)
			{
				request.get({uri:baseUrl+"/api/users/"+u.id, json:true}, function(err, res, result)
				{
					assert.equal(result.name, u.name);
					done();
				});
			});
		});

	});

	describe("GET /api/users/{ID}/{prop}", function()
	{
		it("should return the correct property for user data", function(done)
		{
			var name = "Bubba"+new Date().getTime();
			var u = new User({name:name});
			u.save(function(err)
			{
				request.get({uri:baseUrl+"/api/users/"+u.id+"/name", json:true}, function(err, res, result)
				{
					assert.equal(result, u.name);
					done();
				});
			});
		});
	});

	describe("PUT /api/users/{ID}/{prop}", function()
	{
		it("should correctly set the specified property on the user data", function(done)
		{
			var name = "Bubba"+new Date().getTime();
			var u = new User({name:name});
			u.save(function(err)
			{
				request.put({uri:baseUrl+"/api/users/"+u.id+"/name", json:"JustPlainBubba"}, function(err, res, result)
				{
					assert.equal(result, "JustPlainBubba");

					User.findOne({"_id":u.id}, function(err, freshUser)
					{
						assert.equal(freshUser.name, "JustPlainBubba");
						done();
					});
				});
			});
		});
	});
});
