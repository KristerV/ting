CircleCollection.allow({
	update: function (userId, doc, fields, modifier) {
		var allowedFields = ['messages', 'lastSeen']
		
		// Pushing to messages or setting lastSeen
		if (userId != null && (modifier.$push != null || modifier.$set != null) && _.difference(fields, allowedFields))
			return true

		if (userId === doc.author)
			return true
	},
	remove: function (userId, doc) {
		if (userId === doc.author)
			return true
	},
	insert: function (userId, doc) {
		if (userId != null)
			return true
	}
})

WikiCollection.allow({
	update: function (userId, doc, fields, modifier) {

		if (userId == null)
			return false
		
		if (userId == doc.author)
			return true

		if (doc.editing == 'locked')
			return false

		if (doc.editing == userId)
			return true

		var allowedFields = ['content', 'editing', 'topic']
		var diff = _.difference(fields, allowedFields)
		if (diff.length == 0)
			return true

		return false
	},
	remove: function (userId, doc) {
		if (userId === doc.author)
			return true
	},
	insert: function (userId, doc) {
		if (userId != null)
			return true
	}
})