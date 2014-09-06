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
		console.log("save")
		var content = $('textarea').val()

		// Don't save accidentally emptied wiki
		if (!isset(content))
			return false
		
		var id = Session.get('module').id
		WikiCollection.update(id, {$set: {content: content}})
	}
}
