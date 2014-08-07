Accounts.ui.config({
   passwordSignupFields: 'USERNAME_AND_EMAIL'
});

Meteor.startup(function(){
	Session.set('circleTopic', 'maincircle')
})