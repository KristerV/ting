Accounts.ui.config({
   passwordSignupFields: 'USERNAME_AND_EMAIL'
});

Session.setDefault('language', 'et')
Session.setDefault('module', {module: 'wall', id: 'announcements'})

Meteor.subscribe("circle")
Meteor.subscribe("allUserData");

Global = {
	bigBlur: function(currentTarget) {

		// If user has been giving keys to a circle
		if (Session.get('toggleAccessToCircle')) {
			var visibility = Session.get("menuVisibilitySave");
			$.each(visibility, function(selector, visible){

				// Don't slide if clicked object already sliding
				if ($(currentTarget).nextAll('.list:first').prop('class') == $(selector).prop('class'))
					return

				if (visible === true) {
					if (!$(selector).is(':visible')) {
						$(selector).velocity('slideDown')
					}
				} else if (visible === false) {
					if ($(selector).is(':visible')) {
						$(selector).velocity('slideUp')
					}
				}
			})
			Session.set('toggleAccessToCircle', null)
		}

		// If any chat option is in progress
		Session.set('isOptionsInProgress', false)

		// If chat options are visible
		if ($('.chat .options').is(':visible'))
			$('.chat .options').velocity('slideUp')

		// 
	}
}