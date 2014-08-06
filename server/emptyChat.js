Meteor.startup(function () {
	// TalkingCircles.remove({})
	var bigCircle = TalkingCircles.findOne('maincircle')
	if (typeof bigCircle == 'undefined') {
		TalkingCircles.insert({topic: 'Suur Ring', 
								_id: 'maincircle',
								created: Date.now(),
								type: 'open'
							})
	}
});
