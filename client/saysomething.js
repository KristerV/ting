Template.saysomething.events({
	'submit form[name=saysomething]': function(e, tmpl) {
		e.preventDefault()
		var data = getFormData('form[name=saysomething]')
		Messages.insert({user: localStorage.getItem('userId'), date: getDate(), name: Session.get('username'), message: data.message, aho: []})
		$('form[name=saysomething] .message').val('')
	}
})