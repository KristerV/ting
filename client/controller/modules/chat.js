Template.chat.helpers({
	messages: function() {
		var id = Session.get('module').id
		var collection = CircleCollection.findOne(id, {fields: {lastSeen: 0}})

		if (!isset(collection) || !isset(collection['messages']))
			return null

		// Save last seen message timestamp
		var lastSeen = {}
		var msgs = collection.messages
		lastSeen['lastSeen.' + Meteor.userId()] = msgs[msgs.length-1].timestamp
		CircleCollection.update(id, {$set: lastSeen})

		// Scroll to the bottom. Unfortunatelly, I don't know a better place to put this
		Meteor.setTimeout(function(){
			Chat.scrollToBottom()
		}, 0)

		return collection['messages']
	},
	msg: function() {
		return new Spacebars.SafeString(this.msg.replace(/(\r\n|\n|\r)/gm, '<br>'))
	},
	username: function() {
		var user = Meteor.users.findOne(this.userid)

		// Perhaps user is missing
		if (!isset(user))
			return Translate('User is missing')

		return user.username
	},
	isOwner: function() {
		var id = Session.get('module').id
		var collection = CircleCollection.findOne(id)
		if (isset(collection) && collection.author == Meteor.userId())
			return true
	},
	is4eyes: function() {
		var id = Session.get('module').id
		var collection = CircleCollection.findOne(id)
		if (isset(collection) && collection.type == '4eyes')
			return true
	},
	isLocked: function() {
		var id = Session.get('module').id
		var collection = CircleCollection.findOne(id)

		if (isset(collection) && collection.type == 'open')
			return false
		else
			return true
	},
	topic: function() {
		var id = Session.get('module').id
		var collection = CircleCollection.findOne(id)

		// Assuming noone is trying random hashes, the user has probably been kicked out
		if (!isset(collection))
			return Translate("Can't find the circle :(")

		return collection.topic
	},
	isSecret: function() {
		var id = Session.get('module').id
		var collection = CircleCollection.findOne(id)
		if (isset(collection) && collection.type == 'closed')
			return true
	},
	isOptionsInProgress: function() {
		return Session.get('isOptionsInProgress')
	},
})

Template.chat.events({
	'submit form[name="chat-msg"]': function(e, tmpl) {
		e.preventDefault()
		Global.bigBlur()
		var msg = $('textarea[name=chat-msg]').val()

		if (!isset(msg))
			return false

		data = {
			msg: msg,
			userid: Meteor.user()._id,
			timestamp: TimeSync.serverTime(Date.now()),
		}

		$('textarea[name=chat-msg]').val('')
		CircleCollection.update(Session.get('module').id, {$push: {messages: data}})
	},
	'submit form[name=chat-topic], blur input[name=chat-topic]': function(e, tmpl) {
		e.preventDefault()
		var newTopic = $('input[name=chat-topic]').val()

		// No empty topics allowed
		if (!isset(newTopic))
			return false

		Global.bigBlur()
		$('input[name=chat-topic]').prop('disabled', true)
		CircleCollection.update(Session.get('module').id, {$set: {topic: newTopic}})
	},
	'click form[name=chat-topic], click .lock': function(e, tmpl) {

		// Don't do anything if user is editing topic
		if ($('input[name=chat-topic]').prop('disabled') === false)
			return false

		Global.bigBlur()
		var options = $('.module .options')
		if (options.is(":visible"))
			options.velocity('slideUp')
		else
			options.velocity('slideDown')
	},
	'click .js-rename': function(e, tmpl) {
		$('input[name=chat-topic]').prop('disabled', false).focus()
		Session.set('isOptionsInProgress', true)
	},
	'click .js-type': function(e, tmpl) {
		var id = Session.get('module').id
		var collection = CircleCollection.findOne(id)
		var newType

		if (collection.type == 'open')
			newType = 'closed'
		else if (collection.type == 'closed')
			newType = 'open'
		else
			return false

		CircleCollection.update(id, {$set: {type: newType}})
	},
	'click .js-options-stop': function(e, tmpl) {
		Global.bigBlur()
	},
	'click .js-invite': function(e, tmpl) {
		
		// Save visibility for each list
		var visibility = {}
		$('.menu .list').each(function() {
			var classesString = $(this).prop('class')
			var classesArray = classesString.split(' ')
			var selector = '.menu .' + classesArray.join('.')
			visibility[selector] = $(this).is(':visible')
		})
		Session.set("menuVisibilitySave", visibility)

		// SlideUp all but people
		$('.menu .list:not(.people)').velocity('slideUp')
		if (!$('.menu .list.people').is(':visible'))
			$('.menu .list.people').velocity('slideDown')

		// The actual click-to-give-access happens in menuItem.js
		Session.set('toggleAccessToCircle', Session.get('module').id)
		Session.set('isOptionsInProgress', true)
	},
	'click .js-close': function(e, tmpl) {
		var confirmation = confirm(Translate('Are you sure you want to close the circle? All messages will be gove forever.'))
		if (confirmation) {
			CircleCollection.remove(Session.get('module').id)
			Session.set('module', {module: 'wiki', id: 'announcements'})
		}
	},
	'keydown textarea[name=chat-msg]': function(e, tmpl) {
		// Submit when Enter is pressed, but not if modifiers are down
		console.log(e.keyCode)
		console.log(e.originalEvent.keyIdentifier)
		if (e.keyCode == 13 // enter
				&& e.originalEvent.ctrlKey == false
				&& e.originalEvent.altKey == false
				&& e.originalEvent.shiftKey == false
			) 
		{
			$('form[name=chat-msg]').submit()
			return false
		}
	}
})

Template.chat.rendered = function() {
	$('textarea').elastic()
	$('.module .chat .messages').css('padding-top', $(document).height() / 5)
}

Chat = {
	get4eyesId: function(id_other) {
		var id_current = Meteor.userId()
		var id_both = [id_current, id_other]
		id_both.sort()
		var circleId = id_both.join()
		return circleId
	},
	scrollToBottom: function() {
		$('.module .chat').scrollTop($('.module .chat')[0].scrollHeight)
	}
}