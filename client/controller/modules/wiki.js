Template.wiki.helpers({
	isEditMode: function() {
		return Session.get('editMode') === true ? true : false
	},
	content: function() {
		var id = Session.get('module').id
		var collection = WikiCollection.findOne(id)

		if (!isset(collection))
			return false

		var content = collection.content
		var lastContent = content[content.length-1]

		if (Session.get('editMode')) {
			$('textarea').focus()
			return lastContent.text
		} else if (isset(lastContent)) {
			return marked(lastContent.text)
		}
	},
	editMode: function() {
		return Session.get('editMode') === true
	}
})

Template.wiki.events({
	'click .js-edit-mode': function(e, tmple) {
		var editMode = Session.get('editMode')
		if (editMode) {
			Wiki.saveTextarea()
			Session.set('editMode', false)
			Meteor.clearInterval(Session.get('saveTextareaInterval'))
		} else {
			Session.set('editMode', true)
			var intervalId = Meteor.setInterval(function(){
				Wiki.saveTextarea()
			}, 10000)
			Session.set('saveTextareaInterval', intervalId)
		}
	},
	'keydown textarea': function(e, tmpl) {

		// Save every keydown
		// var content = $('textarea').val()
		// var id = Session.get('module').id
		// WikiCollection.update(id, {$set: {content: content}})

	}
})

Wiki = {
	saveTextarea: function() {
		var value = $('textarea').val()

		// BigBlur tries to save even when editMode has already been disabled
		// Don't save accidentally emptied wiki
		if (!isset(value))
			return false

		var lines = value.split('\n')
		var firstLine
		for (var i = 0; i<lines.length; i++) {
			if (isset(lines[i])) {
				firstLine = lines[i]
				break
			}
		}
		firstLine = firstLine.replace(/[^\w\s!?äöüõ]/gi, '')

		var id = Session.get('module').id
		var data = {
			author: Meteor.userId(),
			text: value,
			timestamp: TimeSync.serverTime(Date.now()),
		}
		WikiCollection.update(id, {$set: {topic: firstLine}, $push: {content: data}})
	}
}
