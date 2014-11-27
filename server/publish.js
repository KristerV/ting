Meteor.publish("circle", function () {
	if (!this.userId || isUserLimited(this.userId))
		return null

	return CircleCollection.find({$or: 	[
											{type: 'open'}, 
											{type: 'closed', author: this.userId},
											{type: '4eyes'},
											{type: 'closed', hasAccess: this.userId}
										]
									},
									{fields: {messages: {$slice: -40}}})
});

Meteor.publish("wiki", function () {
	
	if (!this.userId || isUserLimited(this.userId))
		return null

	return WikiCollection.find({}, {fields: {content: {$slice: -1}}})
});

Meteor.publish("allUserData", function () {
	
	if (!this.userId)
		return null

	// User is not limited
	if (!isUserLimited(this.userId))
		return Meteor.users.find({}, {fields: {'username': 1, 'status': 1, 'profile.access': 1,'profile.accessFriends': 1}})

	// User is limited
	return Meteor.users.find(this.userId)
});

isUserLimited = function(userId) {
	var user = Meteor.users.findOne(userId)
	if (isset(user.profile) && isset(user.profile.access) && user.profile.access !== 'limited')
		return false
	
	return true
}