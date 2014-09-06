Template.wiki.helpers({
	isEditMode: function() {
		return Session.get('editMode') === true ? true : false
	},
	content: function() {
		var id = Session.get('module').id
		var collection = WikiCollection.findOne(id)
		if (!isset(collection))
			return false

		if (Session.get('editMode')) {
			$('textarea').focus()
			return collection.content
		} else {
			return marked(collection.content)
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
		var content = $('textarea').val()

		// BigBlur tries to save even when editMode has already been disabled
		if (!isset(content))
			return false

		var firstLine = content.split('\n')[0]
		firstLine = firstLine.replace(/[^\w\s!?äöüõ]/gi, '')

		// Don't save accidentally emptied wiki
		if (!isset(content))
			return false
		
		var id = Session.get('module').id
		WikiCollection.update(id, {$set: {content: content, topic: firstLine}})
	}
}
