Template.userlist.helpers({
	users: function() {
		return Meteor.users.find({}).fetch()
	},
})