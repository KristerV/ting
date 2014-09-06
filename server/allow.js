CircleCollection.allow({
	update: function (userId, doc, fields, modifier) {
		
		// Pushing to messages
		if (userId != null && modifier.$push != null && _.contains(fields, 'messages'))
			return true

		// Pushing to lastSee
		if (userId != null && modifier.$set != null && _.contains(fields, 'lastSeen'))
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
		
		if (userId === doc.author)
			return true
	},
	remove: function (userId, doc) {
		// if (userId === doc.author)
			return true
	},
	insert: function (userId, doc) {
		if (userId != null)
			return true
	}
})