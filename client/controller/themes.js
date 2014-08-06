Template.themes.helpers({
	themes: function() {
		return Chat.find()
	}
})

Template.themes.events({
	'click .theme': function(event, template) {
		var id = event.currentTarget.id
		Session.set('chatTheme', id)
	}
})