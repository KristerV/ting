Accounts.ui.config({
   passwordSignupFields: 'USERNAME_AND_EMAIL'
});

Session.setDefault('language', 'et')
Session.setDefault('module', {module: 'wiki', id: 'announcements'})

Meteor.subscribe("circle")
Meteor.subscribe("wiki")
Meteor.subscribe("allUserData");
Meteor.subscribe("userStatus");

Global = {
	bigBlur: function(currentTarget) {
		var module = Session.get('module')

		if (module.module == 'chat') {

			// If user has been giving keys to a circle
			if (Session.get('toggleAccessToCircle'))
				Chat.stopGivingKeys(currentTarget)
			
		}

		if (module.module == 'wiki') {

			// Get doc
			var doc = WikiCollection.findOne(module.id)
			if (!isset(doc))
				return false

			// Save wiki textarea
			if (doc.editing == Meteor.userId())
				Wiki.stopEdit()
		}
	},
	isAnyInputFocused: function() {
		// Is anything in focus and does textarea exist (must be in wiki edit mode)
		var isFocus = $('input, textarea').is(':focus') || $('.wiki textarea').length > 0

		if (!isFocus) {
			Meteor.clearInterval(Global.isAnyInputFocused)
			Session.set('isFocusGone', true)
		}

		return isFocus
	}
}

// Markup settings
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});

// Templates can use switch like behaviour
UI.registerHelper("equals", function (a, b) {
	return (a == b)
});

// Disable automatic reload on file change, if any input is active
Meteor._reload.onMigrate(function(reloadFunction) {
	if (Global.isAnyInputFocused()) {

		// Keep checking the focus
		Meteor.setInterval(Global.isAnyInputFocused, 1000)

		// Restart onMigrate, when focus is lost
		Deps.autorun(function(c) {
			if (Session.get('isFocusGone')) {
				Session.set('isFocusGone', false)
				c.stop();
				reloadFunction();
			}
		});
		return [false];
	} else {
		Global.bigBlur()
		return [true];
	}
});