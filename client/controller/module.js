Template.module.helpers({
	module: function() {
		var module = Session.get('module').module
		var id = Session.get('module').id

		return Template[module]
	},
})