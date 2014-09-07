Template.menu.helpers({
	practicalList: function() {
		return WikiCollection.find()
	},
	circleList: function() {
		return CircleCollection.find({type: {$in: ['open', 'closed']}})
	},
	peopleList: function() {
		return Meteor.users.find({_id: {$ne: Meteor.userId()}}, {sort: {'status.online': -1}})
	},
})

Template.menu.events({
	'click .heading': function(e, tmpl) {
		Global.bigBlur(e.currentTarget)
		
		var list = $(e.currentTarget).nextAll('.list:first')

		if (list.is(":visible"))
			list.velocity('slideUp')
		else
			list.velocity('slideDown')
	},
	'click .new-circle': function(e, tmpl) {
		Global.bigBlur()
		var circleId = CircleCollection.insert({author: Meteor.userId(), type: 'closed', topic: Translate('new circle')})
		Session.set('module', {
			module: 'chat',
			id: circleId,
		})
	},
	'click .new-practical': function(e, tmpl) {
		Global.bigBlur()

		var wikiId = WikiCollection.insert({
			author: Meteor.userId(), 
			type: 'wiki', 
			topic: Translate('new wiki'), 
			module: 'wiki', 
			content: [{
				author: Meteor.userId(),
				text: 'Kirjuta siia',
				timestamp: TimeSync.serverTime(Date.now()),
			}]
		})
		Session.set('module', {
			module: 'wiki',
			id: wikiId,
		})
		Wiki.startEdit()
	}
})