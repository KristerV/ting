Template.guestbook.helpers({
	items: function() {
		if (Session.get('guestbookReady') && Session.get('collectionReady')) {
			d3collider()
		}
		return null
	},
	messagePresent: function() {
		return Session.get('guestbookMessage')
	},
	guestbookMessage: function() {
		var messages = TalkingCircles.findOne('guestbook').messages
		var msgId = Session.get('guestbookMessage')
		$.each(messages, function(index, obj) {
			if (obj._id == msgId) {
				msg = obj.msg
			}
		})
		return isset(msg) ? msg : null
	},
	circleColor: function() {
		var msgId = Session.get('guestbookMessage')
		var color = $('svg circle#' + msgId).css('fill')
		color = color.replace('rgb', 'rgba').replace(')', ',.3)')
		$('body').css('background-color', color)
		return null
	}
})

Template.guestbook.events({
	'mouseover svg circle': function(e, tmpl) {
		Session.set("guestbookMessage", e.currentTarget.id)
	}
})

Template.guestbook.rendered = function() {
	Session.set('guestbookReady', true)
}