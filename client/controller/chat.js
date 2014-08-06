Template.chat.helpers({
	messages: function() {
		var chat = Chat.findOne(Session.get('chatTopic'))
		return isset(chat) ? chat.messages : null;
	},
	username: function() {
		var user = Meteor.users.findOne(this.userid)
		return isset(user) ? user.username : null
	},
	circle: function() {
		var chat = Chat.findOne(Session.get('chatTopic'))
		if (!isset(chat))
			return null

		if (chat['type'] == 'open')
			chat['type'] = 'avatud'
		else if (chat['type'] == '4eyes')
			chat['type'] = 'kahekõne'
		else
			chat['type'] = 'suletud'

		if (chat['author'])
			chat['author'] = Meteor.users.find(chat['author']).username

		return chat
	}
})

Template.chat.events({
	'submit form[name=chatinput]': function(e, tmpl) {
		e.preventDefault()
		var data = getFormData('form[name=chatinput]')
		data['userid'] = Meteor.userId()
		data['timestamp'] = Date.now()
		Chat.update(Session.get('chatTopic'), {$push: {messages: data}})
		$('form[name=chatinput] input[name=msg]').val('')
	},
	'click .type': function(e, tmpl) {
		var _id = Session.get('chatTopic')
		var circleType = Chat.findOne(_id).type
		if (circleType == 'closed')
			Chat.update(_id, {$set: {type: 'open'}})
		if (circleType == 'open')
			Chat.update(_id, {$set: {type: 'closed'}})
	}
})