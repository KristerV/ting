Template.module.helpers({
	module: function() {
		if (!Session.get('module'))
			return null
		var module = Session.get('module').module
		var id = Session.get('module').id

		return Template[module]
	},
})