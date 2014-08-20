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

		// Get message text
		var messages = TalkingCircles.findOne('guestbook').messages
		var msgId = Session.get('guestbookMessage')
		$.each(messages, function(index, obj) {
			if (obj._id == msgId) {
				msg = obj.msg
			}
		})
		if (!isset(msg))
			return false

		// Make text into square shape
		var msgArray = msg.split(" ")
		lineBreakEvery = Math.sqrt(msgArray.length)
		for (var i=1; i<lineBreakEvery+1; i++)
			msgArray.splice(i*lineBreakEvery, 0, '<br>')
		msg = msgArray.join(" ")

		// Make newlines display properly
		msg = new Spacebars.SafeString(msg)

		// return
		return msg
	},
	circleColor: function() {
		var msgId = Session.get('guestbookMessage')
		var color = $('svg circle#' + msgId).css('fill')
		color = color.replace('rgb', 'rgba').replace(')', ',.3)')
		return color
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