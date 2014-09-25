Meteor.publish("circle", function () {
	if (!this.userId || isUserLimited(this.userId))
		return null

	return CircleCollection.find({$or: 	[
											{type: 'open'}, 
											{type: 'closed', author: this.userId},
											{type: '4eyes'},
											{type: 'closed', hasAccess: this.userId}
	                             		]})
});

Meteor.publish("wiki", function () {
	
	if (!this.userId || isUserLimited(this.userId))
		return null

	return WikiCollection.find({}, {fields: {content: {$slice: -1}}})
});

Meteor.publish("allUserData", function () {
	
	if (!this.userId || isUserLimited(this.userId))
		return null

	return Meteor.users.find({}, {fields: {'username': 1, 'status': 1}})
});

isUserLimited = function(userId) {
	var user = Meteor.users.findOne(userId)
	return !isset(user.access) || user.access == 'limited'
}