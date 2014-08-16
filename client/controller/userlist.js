Template.userlist.helpers({
	users: function() {
		return Meteor.users.find({}).fetch()
	},
	selectUsers: function() {
		return Session.get('selectUsers')
	},
	newMessages: function() {
		var circleId = get4eyesId(this._id)
		return isNewMessages(circleId)
	}
})

Template.userlist.events({
	'click .username:not(.selectUsers)': function(e, tmpl) {
		var id_current = Meteor.userId()
		var id_other = e.currentTarget.id
		var name_current = Meteor.users.findOne(id_current).username
		var name_other = Meteor.users.findOne(id_other).username
		var name_both = name_current + " ja " + name_other

		var circleId = get4eyesId(id_other)

		var circle = TalkingCircles.findOne(circleId)
		if (!isset(circle))
			TalkingCircles.insert({_id: circleId, topic: name_both, type: "4eyes"})
		setLastSeenTimestamp(Session.get('circleTopic'))
		Session.set('circleTopic', circleId)
		setLastSeenTimestamp(circleId)
	}
})

get4eyesId = function(id_other) {
	var id_current = Meteor.userId()
	var id_both = [id_current, id_other]
	id_both.sort()
	var circleId = id_both.join()
	return circleId
}