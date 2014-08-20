TalkingCircles = new Meteor.Collection('circle')
Anncouncements = new Meteor.Collection('announcements')
Settings = new Meteor.Collection('settings')





if (Meteor.isServer) {

	Meteor.users.allow({
		'update': function(userId, doc, fieldNames, modifier) {
			return true;
		},
		'insert': function(userId, doc) {
			return true;
		},
	});
}