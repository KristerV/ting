// Generate userId if none
if (!isset(localStorage.getItem("userId")))
	localStorage.setItem("userId", generateHash());

if (!isset(Messages))
	Messages = new Meteor.Collection('messages1')
