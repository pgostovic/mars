depend("mars.api");
depend("ext.isotope");

var widget =
{
	ready: function($$)
	{
		var _this = this;
		$$("button").click(function()
		{
			_this.doSearch();
		});

		$$(".results").isotope();
	},

	doSearch: function()
	{
		var _this = this;

		var $$ = this.get$$();

		var q = $$("input").val();

		var results = null;

		phnq_core.parallel(function(done)
		{
	        $$(".results").isotope("remove", $$(".results > *"), function()
	    	{
	    		done();
	    	});
		}, function(done)
		{
			mars.api.searchTrack(q, function(_results)
			{
				results = _results;
				done();
			});
		}, function()
		{
			$$(".results").html(_this.renderPartial("searchResult", results));
            $$(".results").isotope("insert", $$(".results > *"));
		});
	}
};
