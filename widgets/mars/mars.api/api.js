depend("phnq.net");

window.mars = window.mars || {};

mars.api =
{
	getCurrentUser: function(fn)
	{
		phnq.net.getJSON("/api/users/me", {}, fn);
	},

	autocomplete: function(query, fn)
	{
		phnq.net.getJSON("/api/autocomplete/"+escape(query), {}, fn);
	},

	searchTrack: function(query, fn)
	{
		phnq.net.getJSON("/api/tracks/search/"+escape(query), {}, fn);
	}
};
