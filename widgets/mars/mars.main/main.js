depend("mars.style");
depend("mars.api");
depend("phnq.hashroutes");

var widget =
{
	ready: function($$)
	{
		phnq.hashroutes.set(
		{
			"default": function(path)
			{
				log.debug("DEFAULT: ", path);
			},

			"/track/(.*)": function(trackId)
			{
				log.debug("track: ", trackId);
			}
		});
	}
};
