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

			// If any chat option is in progress
			Session.set('isOptionsInProgress', false)

			// If chat options are visible
			if ($('.chat .options').is(':visible'))
				$('.chat .options').velocity('slideUp')
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
