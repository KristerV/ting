Template.userlist.helpers({
	users: function() {
		return Meteor.users.find({}).fetch()
	},
})

Template.userlist.events({
	'click .username': function(e, tmpl) {
		var id_current = Meteor.userId()
		var id_other = e.currentTarget.id
		var id_both = [id_current, id_other]
		var name_current = Meteor.users.findOne(id_current).username
		var name_other = Meteor.users.findOne(id_other).username
		var name_both = name_current + " ja " + name_other

		id_both.sort()
		var chatId = id_both.join()

		var chat = Chats.findOne(chatId)
		if (!isset(chat))
			Chats.insert({_id: chatId, topic: name_both, type: "4eyes"})
		Session.set('chatTopic', chatId)
	}
})