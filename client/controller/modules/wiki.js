Template.wiki.helpers({
	scrollIcon: function() {
		// Get doc
		var doc = Wiki.getDoc()
		
		// Collection proably just isn't ready yet
		if (!isset(doc))
			return false

		// Author has different conditions
		if (doc.author == Meteor.userId()) {
			if (doc.editing == Meteor.userId())
				return 'edit'
			if (isset(doc.editing))
				return 'code'
			return 'default'
		}

		// Is editing allowed by the author?
		if (doc.locked)
			return 'black'

		// Are we editing already?
		if (doc.editing == Meteor.userId())
			return 'edit'

		// Is anyone else editing at the moment?
		if (isset(doc.editing))
			return 'code'

		// It's okay to edit
		return 'default'
	},
	content: function() {
		var doc = Wiki.getDoc()

		if (!isset(doc))
			return Translate('Wiki not found')

		var content = doc.content
		var lastContent = content[content.length-1]
		if (!isset(lastContent) || !isset(lastContent.text))
			return Translate('Wiki is empty')

		if (doc.editing == Meteor.userId()) {
			Meteor.setTimeout(function(){
				$('textarea').elastic()
			}, 10)
			return lastContent.text
		} else {
			return marked(lastContent.text)
		}
	},
	locked: function() {
		var doc = Wiki.getDoc()
		if (!isset(doc))
			return false

		return doc.locked
	},
	isOwner: function() {
		var doc = Wiki.getDoc()
		if (!isset(doc))
			return false
		return doc.author == Meteor.userId()
	},
	tableOfContents: function() {
		var doc = Wiki.getDoc()
		if (!isset(doc))
			return false

		var text = doc.content[doc.content.length-1].text
		return Wiki.getTableOfContents(text)
	}
})

Template.wiki.events({
	'click .js-edit-mode': function(e, tmple) {
		var doc = Wiki.getDoc()
		if (doc.editing == Meteor.userId()) {
			Wiki.stopEdit()
		} else {
			Wiki.startEdit()
		}
	},
	'click .js-lock': function(e, tmpl) {
		var doc = Wiki.getDoc()
		if (doc.locked)
			WikiCollection.update(doc._id, {$set: {locked: false}})
		else
			WikiCollection.update(doc._id, {$set: {locked: true}})
	},
	'click .js-remove': function(e, tmpl) {
		var doc = Wiki.getDoc()
		if (doc.author == Meteor.userId()) {
			var confirmation = confirm(Translate('Are you sure you want to delete this wiki? All data will be lost.'))
			if (confirmation) {
				WikiCollection.remove(doc._id)
				Session.set('module', {module: 'wiki', id: 'announcements'})
			}
		}
	},
	'click .js-corner-help': function(e, tmpl) {

		// Get target element
		var elementClass
		var current = $(e.currentTarget)
		if (current.hasClass('js-markdown-help'))
			elementClass = '.markdown-help'
		else if (current.hasClass('js-table-of-contents'))
			elementClass = '.table-of-contents'
		else
			return false

		// Is it visible?
		var elem = $(elementClass)
		var visible = elem.is(':visible')

		// Hide all other helpers
		if ($('.corner-help').is(':visible'))
			$('.corner-help').velocity('slideUp')

		// Hide or show target element
		if (visible)
			elem.velocity('slideUp')
		else
			elem.velocity('slideDown')
	},
	'click .table-of-contents p': function(e, tmpl) {

		// Get title
		var title = $(e.currentTarget).text()
		var title = title.replace(/^[^\w\s!?äöüõ]* |[ ]*$/gi, '') // Trim strange characters and space from front, then space from end

		// Find element with title
		var element = $('.wiki .content .formatted *:contains("' + title + '")')

		// Scroll to title
		$('.wiki').scrollTop(element.offset().top)

	}
})

Wiki = {
	saveTextarea: function() {
		var text = $('textarea').val()

		// BigBlur tries to save even when editing has already been disabled
		// Don't save accidentally emptied wiki
		if (!isset(text))
			return false

		firstLine = Wiki.getFirstLine(text)

		var data = {
			author: Meteor.userId(),
			text: text,
			timestamp: TimeSync.serverTime(Date.now()),
		}
		
		var id = Session.get('module').id
		WikiCollection.update(id, {$set: {topic: firstLine}, $push: {content: data}})
	},
	startEdit: function() {
		var id = Session.get('module').id
		var doc = Wiki.getDoc()

		var intervalId = Meteor.setInterval(function(){
			Wiki.saveTextarea()
		}, 10000)
		Session.set('saveTextareaInterval', intervalId)
		WikiCollection.update(id, {$set: {editing: Meteor.userId()}})
		Meteor.setTimeout(function(){
			$('textarea').focus()
		}, 10)
	},
	stopEdit: function() {
		var id = Session.get('module').id
		Wiki.saveTextarea()
		Meteor.clearInterval(Session.get('saveTextareaInterval'))
		WikiCollection.update(id, {$set: {editing: ''}})
	},
	getFirstLine: function(text) {
		var lines = text.split('\n')
		var firstLine
		for (var i = 0; i<lines.length; i++) {
			if (isset(lines[i])) {
				firstLine = lines[i]
				break
			}
		}
		firstLine = firstLine.replace(/[^\w\s!?äöüõ]/gi, '')
		return firstLine
	},
	getTableOfContents: function(text) {
		// text = text.replace(/[^\w\s!?äöüõ]/gi, '')
		var lines = text.split('\n')
		var newLines = []
		for (var i = 0; i<lines.length; i++) {
			if (lines[i][0] === '#')
				newLines.push(lines[i])
		}
		return newLines
	},
	getDoc: function() {
		var id = Session.get('module').id
		var doc = WikiCollection.findOne(id)
		return doc
	}
}
