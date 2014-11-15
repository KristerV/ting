Meteor.startup(function () {
	Meteor.setInterval(function(){Mailgun.gatherEmails()}, 1000 * 60 * 32)
	// Meteor.setTimeout(function(){Mailgun.gatherEmails()}, 1000)
});

Mailgun = {
	gatherEmails: function() {
		console.log("")
		console.log("Start email gathering")

		var circles = CircleCollection.find().fetch()
		var wikis = WikiCollection.find().fetch()
		var users = Meteor.users.find().fetch()
		var sendEmails = {}
		var now = Date.now()
		var day = 1000 * 60 * 60 * 24

		_.each(users, function(user){
			var userId = user._id
			var email = user.emails[0].address
			var userProfile = user.profile
			var userRoles

			if (isset(userProfile))
				userRoles = typeof user.profile.access == 'object' ? user.profile.access : [user.profile.access]
			
			if (isset(user.profile) && isset(user.profile.access) && _.difference([user.profile.access], ['normal', 'admin']).length == 0) {

				sendEmails[userId] = {}
				console.log("------- " + email + " -------")

				if ((!isset(user['status']) || !isset(user.status['lastLogin']))) { // User is from before user.status time
					if (!isset(user.lastEmail)) {
						console.log("Condition: 0")
						sendEmails[userId]['other'] = Translate("There are too many to count")
					}
				} else {
					var lastEmail = isset(user.lastEmail) ? user.lastEmail : null
					var lastLogin = user.status.lastLogin.date

					// Circles
					sendEmails[userId]['circles'] = []
					_.each(circles, function(circle) {

						// This if defines what circles the user can actually read
						var split = circle._id.split(',')
						if ( 
							(
							 	!isset(lastEmail) // no email sent to person
								|| lastEmail < lastLogin // has logged in since last email
						    )
						    &&
						    (
						     	lastLogin + day < now // It's been 24h since last login
						    )
						    &&
							(
								(circle.type == 'open' // Public chat
									&& isset(circle.subscriptions) 
									&& isset(circle.subscriptions[userId])) // is subscribed
								||
								(circle.type == '4eyes' // 4eyes chat
								 	&& circle._id.indexOf(userId) > -1  // is participant
									&& (split.length === 1 || split[0] != split[1])) // is not selfchat
								||
								(circle.type == 'closed' // Private chat
								 	&& isset(circle.hasAccess) 
									&& isset(circle.hasAccess[userId]) // Has access
									&& isset(circle.subscriptions[userId])) // is subscribed
								||
								circle.author == userId
							)
							&&
							(
							 	// Does circle have messages?
								isset(circle.messages) && isset(circle.messages[circle.messages.length-1])
							)
						)
						{
							// If there are messages and user has not seen any
							if (!isset(circle.lastSeen) || !isset(circle.lastSeen[userId])) {
								console.log('Circle: ' + circle._id)
								console.log("Condition: 1")
								sendEmails[userId]['circles'].push(circle.topic)
							} else if (isset(user['status'])) {
								var lastSeen = circle.lastSeen[userId]
								var lastMessage = circle.messages[circle.messages.length-1].timestamp
								
								if (lastSeen < lastMessage) // Newest message has not been seen 
								{
									console.log('Circle: ' + circle._id)
									console.log("Condition: 2")
									sendEmails[userId]['circles'].push(circle.topic)
								}
							}
						}
					})

					// Wikis
					sendEmails[userId]['wikis'] = []
					_.each(wikis, function(wiki) {
						var lastSeen = wiki.lastSeen[userId]
						var lastChange = wiki.content[wiki.content.length-1].timestamp

						if (isset(wiki.subscriptions) && isset(wiki.subscriptions[userId]) // is subscribed
						    	&& lastSeen < lastChange // haven't seen change
						    	&& lastSeen > lastEmail // Has not already gotten mail about it
						    	&& lastLogin + day < now) { // wait 24h before sending
							console.log('Wiki: ' + wiki._id)
							console.log("Condition: 3")
							sendEmails[userId]['wikis'].push(wiki.topic)
						}
					})
				}
			}
		})
		console.log("Done with gathering")
		this.queueEmails(sendEmails)
		console.log(sendEmails)
	},
	queueEmails: function(collection) {
		if (_.isEmpty(collection))
			return false
		console.log("")
		console.log("Queue emails")
		var timeout = 0

		_.each(collection, function(doc, userId){
			if (isset(doc) && (isset(doc.other) || isset(doc.circles) || isset(doc.wikis))){
				timeout = timeout + (1000 * 35)
				// Hoping to bypass google spam this way
				Meteor.setTimeout(function(){Mailgun.sendNotification(userId, doc)}, timeout)
			}
		})
		console.log("Emails queued")
		console.log("")
	},
	sendNotification: function(userId, doc){

		console.log('Email for user ' + userId  +' at ' + new Date)

		// Add lastEmail to user
		Meteor.users.update(userId, {$set: {lastEmail: Date.now()}})

		// Basic data
		var userEmail = Meteor.users.findOne(userId).emails[0].address
		var username = Meteor.users.findOne(userId).username
		var Digital = new Date()
		var hours = Digital.getHours()

		// Give random subject each time
		if (hours>=5&&hours<=11) {
			var hello = 'Tere hommikust, ' + username
			var regards = 'Head päeva,'
		}
		else if (hours>=12&&hours<=17) {
			var hello = 'Tere päevast, ' + username
			var regards = 'Head päeva jätku,'
		}
		else if (hours>=18&&hours<=21) {
			var hello = 'Tere õhtust, ' + username
			var regards = 'Head ööd,'
		}
		else if (hours>=22&&hours<=23) {
			var hello = 'Tere hilist õhtust, ' + username
			var regards = 'Head ööd,'
		}
		else {
			var hello = 'Tere tere, öökoll'
			var regards = 'Parem on, kui lähed Tingi lehele hommikul,'
		}

		var newsList = ''
		if (isset(doc.other))
			newsList = doc.other
		else {
			var name
			if (isset(doc.circles)) {
				newsList += '<h3>Juturingis:</h3>'
				_.each(doc.circles, function(topic, i) {
					newsList += '<p>' + topic + '</p>'
				})
			} else 
			if (isset(doc.wikis)) {
				newsList += '<h3>Praktiline:</h3>'
				_.each(doc.wikis, function(topic, i) {
					newsList += '<p>' + topic + '</p>'
				})
			}
		}

		var body = '<p>'+hello+'</p>\
		<p>Tingi kodukal on midagi uut:</p>'
		+ newsList +
		'<p><a href="http://ting.ee">ting.ee</a></p>\
		<p>'+regards+'<br>\
		Tingi kirjatuvi<br>\
		P.S. Kui esinevad vead või soovid nimekirjast eemaldamist, kirjuta krister.viirsaar@gmail.com või helista 56355555</p>';

		Mailgun.sendEmail(userEmail, "Midagi uut..", body)		
	},
	sendEmail: function(to, subject, body) {
		if (!to || !subject || !body) {
			console.log("Email broken")
			return false
		}
		console.log("Email to:" + to)
		console.log("Subject:" + subject)

		Meteor.http.post(process.env.MAILGUN_API_URL + '/' + process.env.MAILGUN_DOMAIN + '/messages', 
			{
				auth: "api:" + process.env.MAILGUN_API_KEY,
				params: 
					{"from":"Tingi Kirjatuvi <kirjatuvi@ting.ee>",
						"to":to,
						"subject": subject,
						"html": body,
					}
					
			},
			function(error, result) {
				if(error){
					console.log("Email error: " + error)
				} else {
					console.log("Email sent")
				}
			}
		)
	},
}