Template.bulkemail.helpers({
	peopleCount: function() {
		return Meteor.users.find().count()
	},
	admin: function() {
		return Meteor.user().profile.access == 'admin'
	}
})

Template.bulkemail.events({
	'submit form[name="bulkemail"]': function(e, tmpl) {
		e.preventDefault()

		var subject = $('form[name="bulkemail"] input[name="subject"]').val()
		var body = $('form[name="bulkemail"] textarea[name="body"]').val()
		if (!subject || !body) {
			alert(Translate("All fields are required"))
			return false
		}

		Meteor.call('sendBulkemail', subject, body)

		Session.set('module', {module: 'wiki', id: 'announcements'})
	},
	'submit form[name="testemail"]': function(e, tmpl) {
		e.preventDefault()

		var subject = $('form[name="testemail"] input[name="subject"]').val()
		var body = $('form[name="testemail"] textarea[name="body"]').val()
		if (!subject || !body) {
			alert(Translate("All fields are required"))
			return false
		}

		Meteor.call('sendTestEmail', subject, body)

		Session.set('module', {module: 'wiki', id: 'announcements'})
	},
})