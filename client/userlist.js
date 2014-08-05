Template.userlist.helpers({
	users: function() {
		return Meteor.users.find({}).fetch()
	},
	email: function() {
		return this.emails[0].address
	}
})