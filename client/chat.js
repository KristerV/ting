Template.chat.helpers({
	messages: function() {
		var chat = Chat.findOne(Session.get('chatTheme'))
		return isset(chat) ? chat.messages : null;
	}
})