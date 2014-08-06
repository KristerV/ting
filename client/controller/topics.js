Template.topics.helpers({
	topics: function() {
		var userid = Meteor.userId()
		var findOpen = {type: 'open'}
		var findAuthored = {author: Meteor.userId()}
		var findSecrets = {inCircle: {$in: [Meteor.userId()]}}
		return TalkingCircles.find({$or: [findOpen, findAuthored, findSecrets]})
	}
})

Template.topics.events({
	'click .theme': function(e, template) {
		TalkingCircle.bigBlur()
		var id = e.currentTarget.id
		Session.set('circleTopic', id)
	},
	'click .new': function(e, tmpl) {
		TalkingCircle.bigBlur()
		var circleId = TalkingCircles.insert({author: Meteor.userId(), type: 'closed', topic: 'uus teema'})
		Session.set('circleTopic', circleId)
	}
})