depend("mars.api");
depend("ext.isotope");
depend("ext.jqueryui.autocomplete");

var widget =
{
	ready: function($$)
	{
		var _this = this;

		this.initAutocomplete($$);
		this.initSearch($$);

		$$(".results").isotope({layoutMode:"straightDown"});
		// $$(".results").isotope();

	},

	initAutocomplete: function($$)
	{
		var _this = this;

		$$("input").autocomplete(
		{
			source: function(req, fn)
			{
				log.debug("source", req.term);
				mars.api.autocomplete(req.term, function(result)
				{
					log.debug("result", result);
					fn(result.tracks);
				});
			}
			,
			focus: function(event, ui)
			{
				log.debug("ui", ui);
				$$("input").val(ui.item.track);
				return false;
			}
			,
			select: function(event, ui)
			{
				log.debug("ui", ui);
				$$("input").val(ui.item.track);
				return false;
			}
		}).data("autocomplete")._renderItem = function(ul, item)
		{
			log.debug("render item");

			var acResult = _this.renderPartial("autocompleteResult", item);
			return $( "<li>" )
                .data( "item.autocomplete", item )
                .append(acResult)
                .appendTo( ul );
		};
	},

	initSearch: function($$)
	{
		var _this = this;
		$$("button").click(function()
		{
			_this.doSearch();
		});
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
				log.debug("results: ", _results);
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
