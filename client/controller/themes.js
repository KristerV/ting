Template.themes.helpers({
	themes: function() {
		var open = Chat.find({type: 'open'}).fetch()
		var authored = Chat.find({author: Meteor.userId()}).fetch()
		var themes = open.concat(authored)
		return themes
	}
})

Template.themes.events({
	'click .theme': function(e, template) {
		var id = e.currentTarget.id
		Session.set('chatTopic', id)
	},
	'click .new': function(e, tmpl) {
		var chatId = Chat.insert({author: Meteor.userId(), type: 'closed', topic: 'määramata'})
		Session.set('chatTopic', chatId)
	}
})