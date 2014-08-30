Template.menuItem.events({
	'click .menuItem': function(e, tmpl) {
		var module = $(e.currentTarget).attr('module')
		var id = e.currentTarget.id
		Session.set('module', {module: module, id: id})
	}
})