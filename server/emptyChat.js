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
								notice: 'Siinsed kirjad lähevad otse pealehele, avalikkuse ette. Kirjutagem siia oma põnevaid Tingi kogemusi ja lugusid. Siinne ring on ainukene mida modereeritakse, sest mula ei paista pealehel hästi välja :)'
							})
	}
});
