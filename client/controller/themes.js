Template.themes.helpers({
	themes: function() {
		return Chats.find({$or: [{type: 'open'}, {author: Meteor.userId()}]})
	}
})

Template.themes.events({
	'click .theme': function(e, template) {
		var id = e.currentTarget.id
		Session.set('chatTopic', id)
	},
	'click .new': function(e, tmpl) {
		var chatId = Chats.insert({author: Meteor.userId(), type: 'closed', topic: 'määramata'})
		Session.set('chatTopic', chatId)
	}
})