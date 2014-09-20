FastRender.onAllRoutes(function(urlPath) {
	this.subscribe('circle');
	this.subscribe('wiki');
	this.subscribe('users');
})