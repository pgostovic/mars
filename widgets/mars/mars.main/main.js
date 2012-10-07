depend("mars.style");
depend("mars.api");
depend("phnq.hashroutes");

var widget =
{
	ready: function($$)
	{
		var _this = this;

		this.deck = this.find("phnq.deck")[0];
		this.deck.show("home");

		this.doLayout();

		$(window).resize(function()
		{
			_this.doLayout();
		});

		phnq.hashroutes.set(
		{
			"default": function(path)
			{
				_this.deck.show("search");
			},

			"/search": function()
			{
				_this.deck.show("search");
			},

			"/track/(.*)": function(trackId)
			{
				log.debug("track: ", trackId);
			}
		});
	},

	doLayout: function()
	{
		var deckElmnt = this.deck.getElement();

		var staticHeight = 0;
		$("body").children().each(function()
		{
			if(this != deckElmnt)
				staticHeight += $(this).outerHeight(true);
		});

		$(deckElmnt).height($("body").height() - staticHeight);
	}
};
