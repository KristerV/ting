Template.chat.helpers({
	messages: function() {
		var chat = Chat.findOne(Session.get('chatTheme'))
		return isset(chat) ? chat.messages : null;
	},
	username: function() {
		var user = Meteor.users.findOne(this.userid)
		return isset(user) ? user.username : null
	}
})

Template.chat.events({
	'submit form[name=chatinput]': function(e, tmpl) {
		e.preventDefault()
		var data = getFormData('form[name=chatinput]')
		data['userid'] = Meteor.userId()
		data['timestamp'] = Date.now()
		Chat.update(Session.get('chatTheme'), {$push: {messages: data}})
		$('form[name=chatinput] input[name=msg]').val('')
	}
})