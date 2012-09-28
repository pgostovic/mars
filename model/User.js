var mongoose = require("mongoose");
var phnq_core = require("phnq_core");
var log = require("phnq_log").create(__filename);

var userSchema = new mongoose.Schema(
{
	name: String,
	isAnonymous: Boolean
});

phnq_core.extend(userSchema.statics,
{
	findById: function(id, fn)
	{
		User.findOne({"_id":id}, function(err, user)
		{
			fn(err, user);
		});
	}
});

var User = module.exports = mongoose.connection.model("User", userSchema);
