Template.saysomething.events({
	'submit form[name=saysomething]': function(e, tmpl) {
		e.preventDefault()
		var data = getFormData('form[name=saysomething]')
		console.log(data)
		Messages.insert({timestamp: Date.now(), user: localStorage.getItem('userId'), date: getDate(), name: data.name, message: data.message, aho: []})
		$('form[name=saysomething] .message').val('')
	}
})