Meteor.methods({
	inviteIn: function(currentUserId, targetUserId) {
		var targetUser = Meteor.users.findOne(targetUserId)
		var data = {}
		data[currentUserId]

		// if accessFriends doesn't exist
		if (!isset(targetUser.profile) || !isset(targetUser.profile.accessFriends))
			Meteor.users.update(targetUserId, {$set: {'profile.accessFriends': []}})
			
		// If current user is not friend already
		if (!_.contains(targetUser.profile.accessFriends, currentUserId))
			Meteor.users.update(targetUserId, {$push: {'profile.accessFriends': currentUserId}})
		else {
			Meteor.users.update(targetUserId, {$pull: {'profile.accessFriends': currentUserId}})
			return true
		}

		// Is user ready to get access?
		var friends = Meteor.users.findOne(targetUserId).profile.accessFriends
		var friendsNeeded = Meteor.users.find({'profile.access': {$in: ['normal', 'admin']}}).count() / 5
		if (friends.length > friendsNeeded || friendsNeeded <= 1) {
			console.log("friend accepted")
			Meteor.users.update(targetUserId, {$set: {'profile.access': ['normal']}})
		}
	},
});