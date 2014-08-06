Meteor.startup(function () {
	var bigCircle = TalkingCircles.findOne('maincircle')
	if (bigCircle == 'undefined') {
		TalkingCircles.insert({topic: 'Suur Ring', 
					_id: 'maincircle',
					created: Date.now(),
					})
	}
});
