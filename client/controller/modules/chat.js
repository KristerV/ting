Template.chat.helpers({
	messages: function() {
		var id = Session.get('module').id
		var collection = CircleCollection.findOne(id)

		if (!isset(collection) || !isset(collection['messages']))
			return null

		return collection['messages']
	},
	username: function() {
		var user = Meteor.users.findOne(this.userid)

		// Perhaps user is missing
		if (!isset(user))
			return Translate('User is missing')

		return user.username
	}
})

Template.chat.events({
	'submit form[name="chat-msg"]': function(e, tmpl) {
		e.preventDefault()
		var msg = $('input[name=chat-msg]').val()

		if (!isset(msg))
			return false

		data = {
			msg: msg,
			userid: Meteor.user()._id,
			timestamp: Date.now(),
		}

		CircleCollection.update(Session.get('module').id, {$push: {messages: data}})
		$('input[name=chat-msg]').val('')
	}
})

Chat = {
	get4eyesId: function(id_other) {
		var id_current = Meteor.userId()
		var id_both = [id_current, id_other]
		id_both.sort()
		var circleId = id_both.join()
		return circleId
	}
}