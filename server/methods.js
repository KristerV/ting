Meteor.methods({
	inviteIn: function(currentUserId, targetUserId) {
		var data = {}
		data[currentUserId]

		// if accessFriends doesn't exist
		var targetUser = Meteor.users.findOne(targetUserId)
		if (!isset(targetUser.profile) || !isset(targetUser.profile.accessFriends))
			Meteor.users.update(targetUserId, {$set: {'profile.accessFriends': []}})
			
		// If current user is not friend already
		targetUser = Meteor.users.findOne(targetUserId)
		if (!_.contains(targetUser.profile.accessFriends, currentUserId))
			Meteor.users.update(targetUserId, {$push: {'profile.accessFriends': currentUserId}})
		else {
			Meteor.users.update(targetUserId, {$pull: {'profile.accessFriends': currentUserId}})
			return true
		}

		// Is user ready to get access?
		targetUser = Meteor.users.findOne(targetUserId)
		var friends = targetUser.profile.accessFriends
		var friendsNeeded = Meteor.users.find({'profile.access': {$in: ['normal', 'admin']}}).count() / 20
		if (friends.length > friendsNeeded || friendsNeeded <= 1) {
			Meteor.users.update(targetUserId, {$set: {'profile.access': ['normal']}})
			Email.send({
				from: "kirjatuvi@ting.ee",
				to: targetUser.emails[0].address,
				subject: Translate("You have been accepted into ting.ee"),
				text: Translate("Hi,\n\nJust letting you know you can now access ting.ee\n\nWelcome,\nTing.ee"),
			})
		}
	},
	sendBulkemail: function(subject, body) {
		if (!subject || !body) {
			console.log("Bulk email empty field")
			return false
		}
		Mailgun.sendEmail('krister.viirsaar@gmail.com', subject, body)
		var users = Meteor.users.find().fetch()
		for (var i = 0; i < users.length; i++) {
			var email = users[i].emails[0].address
			// Mailgun.sendEmail(email, subject, body)
		}

	},
});