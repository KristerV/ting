Meteor.startup(function () {
	Meteor.setInterval(function(){
		console.log("")
		console.log("Start email gathering")

		var circles = CircleCollection.find().fetch()
		var users = Meteor.users.find().fetch()
		var sendEmails = []

		_.each(users, function(user){
			var userId = user._id
			var email = user.emails[0].address
			console.log("------- " + email + " -------")

			_.each(circles, function(circle) {

				// This if defines what circles the user can actually read
				if (
					(
						circle.type == 'open' // Public chat
						||
						(circle.type == '4eyes' && circle._id.indexOf(userId) > -1) // 4eyes and is participant
						||
						(circle.type == 'closed' && isset(circle.hasAccess) && isset(circle.hasAccess[userId])) // Has access to private chat
						||
						circle.author == userId
					)
					&&
					(
					 	// And whether the circle actually has any messages
						isset(circle.messages) && isset(circle.messages[circle.messages.length-1])
					)
				)
				{
					// If there are messages and user has not seen any
					if (!isset(circle.lastSeen)) {
						console.log('Circle: ' + circle._id)
						console.log("Condition: 1")
						sendEmails.push({email: email, userId: userId})
					} else {
						var lastSeen = circle.lastSeen[userId]
						var lastMessage = circle.messages[circle.messages.length-1].timestamp
						var lastEmail = isset(user.lastEmail) ? user.lastEmail : null
						var day = 1000 * 60 * 60 * 24

						// lastSeen must be more than 24hours since last email
						if (lastSeen < lastMessage && lastSeen > lastEmail + day) {
							console.log('Circle: ' + circle._id)
							console.log("Condition: 2")
							sendEmails.push({email: email, userId: userId})
						}
					}

					
				}
			})
		})
		var sendEmails = _.uniq(sendEmails, false, function(item, key, a){
			return item.email
		})
		emailReminders(sendEmails)
	}, 1000 * 60 * 60)
});

emailReminders = function(collection) {
	console.log("")
	console.log("Start emailing")

	_.each(collection, function(doc){
		console.log(doc)

		// Add lastEmail to user
		Meteor.users.update(doc.userId, {$set: {lastEmail: Date.now()}})

		// Make body
		var username = Meteor.users.findOne(doc.userId).username
		var Digital = new Date()
		var hours = Digital.getHours()

		// Configure message below to your own.
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

		var body = '<p>'+hello+'</p>\
		<br>\
		<p>Keegi on viimase 24 tunni jooksul midagi uut Ting.ee-s jutustanud, järsku sind huvitab?</p>\
		<br>\
		<p><a href="http://ting.ee">ting.ee</a></p>\
		<br>\
		<p>'+regards+'</p>\
		<p>Tingi kirjatuvi</p>\
		<br>\
		<p>P.S. Kahjuks ei ole hetkel e-maili sätteid võimalik muuta. Aga andke teada oma soovidest Arenduse teema all!</p>\
		<p>P.S.S. Siia emailile vastates ei näe seda hetkel veel keegi.</p>';

		Meteor.http.post(process.env.MAILGUN_API_URL + '/' + process.env.MAILGUN_DOMAIN + '/messages', 
			{
				auth:"api:" + process.env.MAILGUN_API_KEY,
				params: {"from":"Tingi Kirjatuvi <kirjatuvi@ting.ee>",
					"to":[doc.email],
					"subject": "Sul on lugemata juttu",
					"html": body,
				}
			},
			function(error, result) {
				if(error){
					console.log("Error: " + error)
				} else {
					console.log("Email sent")
				}
			}
		);
	})
	console.log("Emailing complete")
	console.log("")
	
}