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
				var split = circle._id.split(',')
				if (
					(
						circle.type == 'open' // Public chat
						||
						(circle.type == '4eyes' && circle._id.indexOf(userId) > -1 && (split.length === 1 || split[0] != split[1])) // 4eyes and is participant but not self-chat
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
					if ((!isset(circle.lastSeen) || !isset(user['status']) || !isset(user.status['lastLogin'])) && !isset(user.lastEmail)) {
						console.log('Circle: ' + circle._id)
						console.log("Condition: 1")
						sendEmails.push({email: email, userId: userId})
					} else {
						var lastSeen = circle.lastSeen[userId]
						var lastMessage = circle.messages[circle.messages.length-1].timestamp
						var lastEmail = isset(user.lastEmail) ? user.lastEmail : null
						var lastLogin = user.status.lastLogin.date
						var now = Date.now()
						var day = 1000 * 60 * 60 * 24

						// lastSeen must be more than 24hours since last email
						if (lastSeen < lastMessage && lastSeen > lastEmail + day && lastLogin + day < now) {
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
		console.log("Done with gathering")
		emailReminders(sendEmails)
	}, 1000 * 60 * 35) // the interval that email gathering is done
});

emailReminders = function(collection) {
	if (_.isEmpty(collection))
		return false
	console.log("")
	console.log("Queue emails")
	var timeout = 0

	_.each(collection, function(doc){
		timeout = timeout + (1000 * 71)
		// Hoping to bypass google spam this way
		Meteor.setTimeout(function(){
			console.log('Email' +   +': ' + new Date)
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

			var subjects = [
				'Keegi seletab midagi',
				'Miskit tarka räägitakse',
				'Kellegil on jutustamise hoog sees',
				'Pulk pole veel raugenud',
				'Juttu jätkub',
				'Midagi põnevat',
				'Kujuta ette...',
				'Lõpuks saadeti pulk edasi',
				'Pulk on jõudnud sinuni',
				'Järsku on midagi arukat?',
				'Mull mull mull mull väiksed kalad',
				'Kes see neid teateid välja mõtleb ei tea?',
				'Kolmas ring on täis',
				'Käisid vetsus ära? Ühine meiega jälle',
				'Tulin sulle teada andma',
				'kopp-kopp',
				'Midagi uut',
				'Meeldivat',
				'Hea kõla',
				'Armas jutustaja',
				'Saaks vahel õige kokku?',
				'Tule tee parem ettepanek',
				'Lauluga kaasa',
				'Tants on rahunenud, pulk läheb edasi',
				'Digipulk on igavese jaksuga',
				'Ringid on siin lõputud',
				'Helisev lugude jutustus',
				'piiks-piiks',
				'Midagi head',
				'Kallis karmavõlg, olen sulle tänulik',
			]

			var body = '<p>'+hello+'</p>\
			<p>Keegi on viimase 24 tunni jooksul midagi uut Ting.ee-s jutustanud, järsku sind huvitab?</p>\
			<p><a href="http://ting.ee">ting.ee</a></p>\
			<p>'+regards+'<br>\
			Tingi kirjatuvi<br>\
			P.S. Kahjuks ei ole hetkel e-maili sätteid võimalik muuta. Aga andke teada oma soovidest Arenduse teema all!\
			P.S.S. Siia emailile vastates ei näe seda hetkel veel keegi.</p>';

			Meteor.http.post(process.env.MAILGUN_API_URL + '/' + process.env.MAILGUN_DOMAIN + '/messages', 
				{
					auth:"api:" + process.env.MAILGUN_API_KEY,
					params: {"from":"Tingi Kirjatuvi <kirjatuvi@ting.ee>",
						"to":[doc.email],
						"subject": subjects[Math.floor(Math.random() * subjects.length)],
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
		}, timeout)
	})
	console.log("Emails queued")
	console.log("")
	
}