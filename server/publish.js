Meteor.publish("circle", function () {
	
	if (!this.userId)
		return null

	return CircleCollection.find({$or: 	[
											{type: 'open'}, 
											{type: 'closed', author: this.userId},
											{type: '4eyes'},
											{type: 'closed', hasAccess: this.userId}
	                             		]})
});

Meteor.publish("allUserData", function () {
  return Meteor.users.find({}, {fields: {'username': 1}})
});