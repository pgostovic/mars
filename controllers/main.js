
exports.init = function(app)
{
	app.get("/", function(req, res)
	{
		res.renderWidget("mars.main");
	});
};
