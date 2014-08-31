Template.menu.helpers({
	practicalList: function() {
		return [
			{
				_id: 'announcements',
				topic: Translate('Announcements'),
				module: 'wall',
			},
			{
				_id: 'inventory',
				topic: Translate('Inventory'),
				module: 'inventory',
			},
			{
				_id: 'knowledgebase',
				topic: Translate('Knowledgebase'),
				module: 'wall',
			},
			{
				_id: 'focalizers',
				topic: Translate('Focalizers'),
				module: 'wall',
			},
			{
				_id: 'homes',
				topic: Translate('Homes'),
				module: 'wall',
			},
		]
	},
	circleList: function() {
		return CircleCollection.find({type: {$in: ['open', 'closed']}})
	},
	peopleList: function() {
		return Meteor.users.find()
	},
})

Template.menu.events({
	'click .heading': function(e, tmpl) {
		
		var list = $(e.currentTarget.nextElementSibling)

		if (list.is(":visible"))
			list.velocity('slideUp')
		else
			list.velocity('slideDown')
	},
	'click .new-circle': function(e, tmpl) {
		var circleId = CircleCollection.insert({author: Meteor.userId(), type: 'closed', topic: Translate('new circle')})
		Session.set('module', {
			module: 'chat',
			id: circleId,
		})
	}
})