Accounts.ui.config({
   passwordSignupFields: 'USERNAME_ONLY'
});

Meteor.startup(function(){
	Session.set('talkingCircleTopic', 'maincircle')
})