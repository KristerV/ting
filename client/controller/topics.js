Template.topics.helpers({
	topics: function() {
		var userid = Meteor.userId()
		var findOpen = {type: 'open'}
		var findAuthored = {author: Meteor.userId()}
		var findSecrets = {inCircle: {$in: [Meteor.userId()]}}
		return TalkingCircles.find({$or: [findOpen, findAuthored, findSecrets]})
	},
	newMessages: function() {
		var circleId = this._id
		if (Session.equals('circleTopic', circleId))
			return false

		// Get circle last timestamp
		var lastTimestamp = getLastTimestamp(circleId)
		if (!isset(lastTimestamp))
			return false

		// What's the last message the user saw?
		var lastSeen = getLastSeenTimestamp(circleId)
		if (!isset(lastSeen))
			return true

		// Do they match?
		if (lastSeen === lastTimestamp)
			return false
		else
			return true
	}
})

Template.topics.events({
	'click .theme': function(e, template) {
		TalkingCircle.bigBlur()
		setLastSeenTimestamp(Session.get('circleTopic'))
		Session.set('circleTopic', e.currentTarget.id)
		setLastSeenTimestamp(e.currentTarget.id)
	},
	'click .new': function(e, tmpl) {
		TalkingCircle.bigBlur()
		var circleId = TalkingCircles.insert({author: Meteor.userId(), type: 'closed', topic: 'uus teema'})
		Session.set('circleTopic', circleId)
	}
})

getLastTimestamp = function(circleId) {
	var circle = TalkingCircles.findOne(circleId)
	if (!isset(circle))
		return false
	if (!isset(circle['messages']))
		return false
	var messages = circle.messages
	var lastMessage = messages[messages.length-1]
	if (!isset(lastMessage['timestamp']))
		return false
	var lastTimestamp = lastMessage.timestamp
	return lastTimestamp
}

getLastSeenTimestamp = function(circleId) {
	var lastSeen = null
	var userId = Meteor.userId()
	var userObj = Meteor.users.findOne(userId)
	if (!isset(userObj['profile']) || !isset(userObj['profile']['circles']))
		return false
	$.each(userObj['profile']['circles'], function(index, obj) {
		if (isset(obj['circle']) && obj.circle == circleId) {
			lastSeen = obj.lastSeen
		}
	})
	return lastSeen
}

setLastSeenTimestamp = function(circleId) {
	var userId = Meteor.userId()

	if (!isset(Meteor.user()['profile']))
		Meteor.users.update(userId, {$set: {profile: {}}})
	if (!isset(Meteor.user()['profile']['circles']))
		Meteor.users.update(userId, {$set: {profile: {circles: []}}})

	Meteor.users.update(userId, {$pull: {'profile.circles': {circle: circleId}}})
	Meteor.users.update(userId, {$push: {'profile.circles': {circle: circleId, lastSeen: getLastTimestamp(circleId)}}})
}