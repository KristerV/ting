Accounts.ui.config({
   passwordSignupFields: 'USERNAME_AND_EMAIL'
});

Meteor.startup(function(){
	Session.set('circleTopic', 'maincircle')
})


// Disable automatic reload on file change
Meteor._reload.onMigrate(function(reloadFunction) {
	return [false];
});