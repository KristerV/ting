Template.guestbook.helpers({
	items: function() {
		// var guestbook = TalkingCircles.findOne('guestbook')
		// return isset(guestbook) ? guestbook.messages : null
		console.log("warmup")
		if (Session.get('guestbookReady') && Session.get('collectionReady')) {
			console.log("GO")
			d3collider()
		}
		return null
	}
})

Template.guestbook.rendered = function() {
	Session.set('guestbookReady', true)
}