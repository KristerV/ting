
Meteor.startup(function () {
	var bigCircle = Chat.findOne('maincircle')
	if (bigCircle == 'undefined') {
		Chat.insert({topic: 'Suur Ring', 
					_id: 'maincircle',
					created: Date.now(),
					})
	}
});
