Template.topics.helpers({
	topics: function() {
		return TalkingCircles.find({$or: [{type: 'open'}, {author: Meteor.userId()}]})
	}
})

Template.topics.events({
	'click .theme': function(e, template) {
		var id = e.currentTarget.id
		Session.set('circleTopic', id)
	},
	'click .new': function(e, tmpl) {
		var circleId = TalkingCircles.insert({author: Meteor.userId(), type: 'closed', topic: 'avatud teema'})
		Session.set('circleTopic', circleId)
	}
})