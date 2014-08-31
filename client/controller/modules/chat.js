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
	},
	isOwner: function() {
		var id = Session.get('module').id
		var collection = CircleCollection.findOne(id)
		if (isset(collection) && collection.author == Meteor.userId())
			return true
	},
	isLocked: function() {
		var id = Session.get('module').id
		var collection = CircleCollection.findOne(id)

		if (isset(collection) && collection.type == 'open')
			return false
		else
			return true
	},
	topic: function() {
		var id = Session.get('module').id
		var collection = CircleCollection.findOne(id)
		if (isset(collection))
			return collection.topic
	},
	isSecret: function() {
		var id = Session.get('module').id
		var collection = CircleCollection.findOne(id)
		if (isset(collection) && collection.type == 'closed')
			return true
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

		$('input[name=chat-msg]').val('')
		CircleCollection.update(Session.get('module').id, {$push: {messages: data}})
	},
	'submit form[name=chat-topic]': function(e, tmpl) {
		e.preventDefault()
		var newTopic = $('input[name=chat-topic]').val()

		// No empty topics allowed
		if (!isset(newTopic))
			return false

		$('input[name=chat-topic]').prop('disabled', true)
		CircleCollection.update(Session.get('module').id, {$set: {topic: newTopic}})
	},
	'click .js-rename': function(e, tmpl) {
		$('input[name=chat-topic]').prop('disabled', false).focus()
	},
	'click .js-type': function(e, tmpl) {
		var id = Session.get('module').id
		var collection = CircleCollection.findOne(id)
		var newType

		if (collection.type == 'open')
			newType = 'closed'
		else if (collection.type == 'closed')
			newType = 'open'
		else
			return false

		CircleCollection.update(id, {$set: {type: newType}})
	},
	'click .js-invite': function(e, tmpl) {
		console.log("js-invite")
	},
	'click .js-close': function(e, tmpl) {
		console.log("js-close")
	},
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