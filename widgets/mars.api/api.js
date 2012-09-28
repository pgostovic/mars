depend("phnq.net");

window.mars = window.mars || {};

mars.api =
{
	getCurrentUser: function(fn)
	{
		phnq.net.getJSON("/api/users/me", {}, fn);
	}
};
