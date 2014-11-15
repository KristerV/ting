Template.bulkemail.helpers({
	peopleCount: function() {
		return Meteor.users.find().count()
	}
})

Template.bulkemail.events({
	'submit form[name="bulkemail"]': function(e, tmpl) {
		e.preventDefault()

		var subject = $('input[name="subject"]').val()
		var body = $('textarea[name="body"]').val()
		if (!subject || !body) {
			alert(Translate("All fields are required"))
			return false
		}

		var userEmails = []
		var users = Meteor.users.find().fetch()
		for (var i = 0; i < .length; i++) {
			userEmails.push(users[i].emails[0].address)
		};

		Mailgun.sendEmail(userEmails, subject, body)
	}
})