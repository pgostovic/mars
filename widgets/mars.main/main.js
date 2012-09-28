depend("mars.api");

var widget =
{
	ready: function($$)
	{
		mars.api.getCurrentUser(function(user)
		{
			log.debug("The current user is: ", user);
		});
	}
};
