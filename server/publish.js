Meteor.publish("circle", function () {
	return CircleCollection.find({$or: [{type: 'open'}, 
	                             		{type: 'closed', author: this.userId}]})
});
