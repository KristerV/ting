
Meteor.startup(function () {
	var bigCircle = Chats.findOne('maincircle')
	if (bigCircle == 'undefined') {
		Chats.insert({topic: 'Suur Ring', 
					_id: 'maincircle',
					created: Date.now(),
					})
	}
});
