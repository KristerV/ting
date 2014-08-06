Template.chat.helpers({
	messages: function() {
		var chat = Chats.findOne(Session.get('chatTopic'))
		return isset(chat) ? chat.messages : null;
	},
	username: function() {
		var user = Meteor.users.findOne(this.userid)
		return isset(user) ? user.username : null
	},
	circle: function() {
		var chat = Chats.findOne(Session.get('chatTopic'))
		if (!isset(chat))
			return null

		if (chat['type'] == 'open')
			chat['typeEst'] = 'avatud'
		else if (chat['type'] == '4eyes')
			chat['typeEst'] = 'kahekõne'
		else if (chat['type'] == 'closed')
			chat['typeEst'] = 'suletud'

		if (chat['author'])
			chat['authorName'] = Meteor.users.findOne(chat['author']).username

		return chat
	},
	topicAuthor: function() {
		return this.author == Meteor.userId()
	},
	changeType: function() {
		return this.type != '4eyes' && this.author == Meteor.userId()
	}
})

Template.chat.events({
	'submit form[name=chatinput]': function(e, tmpl) {
		e.preventDefault()
		var data = getFormData('form[name=chatinput]')
		data['userid'] = Meteor.userId()
		data['timestamp'] = Date.now()
		Chats.update(Session.get('chatTopic'), {$push: {messages: data}})
		$('form[name=chatinput] input[name=msg]').val('')
	},
	'click .type': function(e, tmpl) {
		var _id = Session.get('chatTopic')
		var circleType = Chats.findOne(_id).type
		if (circleType == 'closed')
			Chats.update(_id, {$set: {type: 'open'}})
		if (circleType == 'open')
			Chats.update(_id, {$set: {type: 'closed'}})
	},
	'click .topic': function(e, tmpl) {
		Chat.editTopic()
	},
	'submit form[name=edittopic]': function(e, tmpl) {
		e.preventDefault()
		Chat.doneEditingTopic()
	},
	'blur form[name=edittopic] input': function(e, tmple) {
		Chat.doneEditingTopic()
	}
})

Chat = {
	editTopic: function(){
		var _id = Session.get('chatTopic')
		var topic = Chats.findOne(_id).topic
		$('.chat .topic.small-button').css('display', 'none').after('\
																	<form name="edittopic">\
																		<input name="topic" type="text">\
																		<input type="submit" value="salvesta">\
																	</form>')
		$('form[name=edittopic] input[type=text]').val(topic).focus().select()
		Meteor.flush()
	},
	doneEditingTopic: function() {
		var _id = Session.get('chatTopic')
		var data = getFormData('form[name=edittopic]')
		Chats.update(_id, {$set: data})
		$('form[name=edittopic]').remove()
		$('.chat .topic.small-button').css('display', 'inline-block')
	}
}