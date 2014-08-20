Meteor.startup(function () {
	// TalkingCircles.remove({})
	// Meteor.users.remove({})
	var bigCircle = TalkingCircles.findOne('maincircle')
	if (typeof bigCircle == 'undefined') {
		TalkingCircles.insert({topic: 'Suur Ring', 
								_id: 'maincircle',
								created: Date.now(),
								type: 'open'
							})
	}
	var guestbook = TalkingCircles.findOne('guestbook')
	if (typeof guestbook == 'undefined') {
		TalkingCircles.insert({topic: 'Tingi Kogemused', 
								_id: 'guestbook',
								created: Date.now(),
								type: 'open',
								notice: 'Tähelepanu! Selle ringi teemaks on Kogemused. Siinsed kirjad lähevad otse ting.ee avalikule lehele. Teemast mööda minevad kirjad kustutatakse.'
							})
	}
});
