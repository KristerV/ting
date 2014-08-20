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
		TalkingCircles.insert({topic: 'Külalisteraamat', 
								_id: 'guestbook',
								created: Date.now(),
								type: 'open',
								notice: 'Tähelepanu! Siin oleva juturingi teemaks on igavesti Külalisteraamat. Kirjuta siia seda, mida tahaksid, et jõuaks ting.ee avalikule lehele. Põhiliselt võiksid koguneda siia Tingiga seonduvad kogemused. Hea või halb, olgem ausad. See on ainuke ring, mida modereeritakse, kustutamisele kuuluvad kirjad, mis lähevad teemast mööda.'
							})
	}
});
