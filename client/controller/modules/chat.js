Template.chat.helpers({
	messages: function() {
		var id = Session.get('module').id
		var doc = CircleCollection.findOne(id, {fields: {lastSeen: 0}})

		if (!isset(doc) || !isset(doc['messages']))
			return null

		// Save last seen message timestamp
		var lastSeen = {}
		var msgs = doc.messages
		lastSeen['lastSeen.' + Meteor.userId()] = msgs[msgs.length-1].timestamp
		CircleCollection.update(id, {$set: lastSeen})

		// Scroll to the bottom. Unfortunatelly, I don't know a better place to put this
		Meteor.setTimeout(function(){
			Chat.scrollToBottom()
		}, 0)

		return doc['messages']
	},
	username: function() {
		var user = Meteor.users.findOne(this.userid)

		// Perhaps user is missing
		if (!isset(user))
			return Translate('User is missing')

		return user.username
	},
	msgDate: function() {
		var stamp = moment(this.timestamp)
		var now = moment(TimeSync.serverTime(Date.now()))
		if (stamp.diff(now, 'days') < -2)
			return moment(stamp).format('DD.MM.YYYY')
		else
			return moment(stamp).calendar()
	},
	msg: function() {
		Meteor.setTimeout(function(){
			$('textarea').focus()
		},10)
		return new Spacebars.SafeString(this.msg.replace(/(\r\n|\n|\r)/gm, '<br>'))
	},
	isOwner: function() {
		var id = Session.get('module').id
		var doc = CircleCollection.findOne(id)
		if (isset(doc) && doc.author == Meteor.userId())
			return true
		if (Meteor.users.findOne(Meteor.userId()).profile.access == 'admin')
			return true
	},
	isAdmin: function() {
		if (Meteor.users.findOne(Meteor.userId()).profile.access == 'admin')
			return true
	},
	is4eyes: function() {
		var id = Session.get('module').id
		var doc = CircleCollection.findOne(id)
		if (isset(doc) && doc.type == '4eyes')
			return true
	},
	isLocked: function() {
		var id = Session.get('module').id
		var doc = CircleCollection.findOne(id)

		if (isset(doc) && doc.type == 'open')
			return false
		else
			return true
	},
	topic: function() {
		var id = Session.get('module').id
		var doc = CircleCollection.findOne(id)

		// Assuming noone is trying random hashes, the user has probably been kicked out
		if (!isset(doc))
			return Translate("Can't find the circle :(")

		return doc.topic
	},
	isSecret: function() {
		var id = Session.get('module').id
		var doc = CircleCollection.findOne(id)
		if (isset(doc) && doc.type == 'closed')
			return true
	},
	isInviting: function() {
		return Session.get('toggleAccessToCircle')
	},
	subscribed: function() {
		var id = Session.get('module').id
		var doc = CircleCollection.findOne(id)
		var userId = Meteor.userId()

		if (_.isUndefined(doc) || _.isUndefined(doc.subscriptions) || !isset(doc.subscriptions[userId]))
			return false
		else
			return true
	},
	not4Eyes: function() {
		var id = Session.get('module').id
		var doc = CircleCollection.findOne(id)
		if (!isset(doc))
			return false

		if (_.isUndefined(doc.type) || doc.type !== '4eyes')
			return true
		else
			return false
	}
})

Template.chat.events({
	'submit form[name="chat-msg"]': function(e, tmpl) {
		e.preventDefault()
		Global.bigBlur()
		var msg = $('textarea[name=chat-msg]').val()
		var id = Session.get('module').id
		var doc = CircleCollection.findOne(id)
		var userId = Meteor.userId()

		if (!isset(msg))
			return false

		// If subscription preference not saved, set to true
		if (_.isUndefined(doc.subscriptions) || _.isUndefined(doc.subscriptions[userId])) {
			var subs = {}
			subs['subscriptions.'+userId] = true
			CircleCollection.update(id, {$set: subs})
		}

		data = {
			msg: msg,
			userid: userId,
			timestamp: TimeSync.serverTime(Date.now()),
		}

		$('textarea[name=chat-msg]').val('')
		CircleCollection.update(id, {$push: {messages: data}})
	},
	'submit form[name=chat-topic], blur input[name=chat-topic]': function(e, tmpl) {
		e.preventDefault()
		var newTopic = $('input[name=chat-topic]').val()

		// No empty topics allowed
		if (!isset(newTopic))
			return false

		CircleCollection.update(Session.get('module').id, {$set: {topic: newTopic}})
	},
	'click .js-public': function(e, tmpl) {
	},
	'click .js-type': function(e, tmpl) {
		var id = Session.get('module').id
		var doc = CircleCollection.findOne(id)
		var newType

		if (doc.type == 'open')
			newType = 'closed'
		else if (doc.type == 'closed')
			newType = 'open'
		else
			return false

		CircleCollection.update(id, {$set: {type: newType}})
	},
	'click .js-invite': function(e, tmpl) {
		
		if (Session.get('toggleAccessToCircle'))
			Chat.stopGivingKeys()
		else
			Chat.startGivingKeys()
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
		if (e.keyCode == 13 // enter
				&& e.originalEvent.ctrlKey == false
				&& e.originalEvent.altKey == false
				&& e.originalEvent.shiftKey == false
			) 
		{
			$('form[name=chat-msg]').submit()
			return false
		}
	},
	'click .js-subscribe': function(e, tmpl) {
		var id = Session.get('module').id
		var doc = CircleCollection.findOne(id)
		var userId = Meteor.userId()
		var data = {}
		if (!isset(doc))
			return false

		if (isset(doc.subscriptions) && isset(doc.subscriptions[userId]))
			data['subscriptions.'+userId] = false
		else
			data['subscriptions.'+userId] = true
		
		CircleCollection.update(doc._id, {$set: data})
	},
	'click .js-removeUser': function(e) {
		var chatId = Session.get('module').id
		var chat = CircleCollection.findOne(chatId)
		console.log(chat)
		// Meteor.users.update()
	},
	'click .js-allowUser': function(e) {
		// Meteor.users.update()
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
		if (Session.get('module').module == 'chat') // I don't know why scrollToBottom gets called when entering wikiEditMode
			$('.module .chat').scrollTop($('.module .chat')[0].scrollHeight)
	},
	stopGivingKeys: function(currentTarget) {
		var visibility = Session.get("menuVisibilitySave");
		$.each(visibility, function(selector, visible){
			// Don't slide if clicked object already sliding
			if ($(currentTarget).nextAll('.list:first').prop('class') == $(selector).prop('class'))
				return
			if (visible === true) {
				if (!$(selector).is(':visible')) {
					$(selector).velocity('slideDown')
				}
			} else if (visible === false) {
				if ($(selector).is(':visible')) {
					$(selector).velocity('slideUp')
				}
			}
		})
		Session.set('toggleAccessToCircle', null)
	},
	startGivingKeys: function() {

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
	}
}