Meteor.publish("circle", function () {
	
	if (!this.userId)
		return null

	return CircleCollection.find({$or: [{type: 'open'}, 
	                             		{type: 'closed', author: this.userId}]})
});
