Accounts.ui.config({
   passwordSignupFields: 'USERNAME_ONLY'
});

Meteor.startup(function(){
	Session.set('circleTopic', 'maincircle')
})