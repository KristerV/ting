Template.whatname.events({
	'submit form': function(e, tmpl) {
		e.preventDefault();
		var data = getFormData('form[name=whatname]')
		if (!isset(data))
			return false
		Session.set('username', data.name)
	}
})