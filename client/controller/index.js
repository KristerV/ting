Accounts.ui.config({
   passwordSignupFields: 'USERNAME_AND_EMAIL'
});

Session.setDefault('language', 'et')
Session.setDefault('module', {module: 'wall', id: 'announcements'})

Meteor.subscribe("circle")
Meteor.subscribe("allUserData");