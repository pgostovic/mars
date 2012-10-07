depend("mars.api");

var widget =
{
	ready: function($$)
	{
		var _this = this;
		$$("button").click(function()
		{
			_this.doSearch();
		});
	},

	doSearch: function()
	{
		var $$ = this.get$$();
		var q = $$("input").val();

		mars.api.searchTrack(q, function(result)
		{
			log.debug("q: ", q, result);
		});
	}
};
