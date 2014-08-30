CircleCollection.allow({
	update: function (userId, doc, fields, modifier) {
		if (userId != null && modifier.$push != null && _.contains(fields, 'messages'))
			return true
	},
	insert: function (userId, doc) {
		if (userId != null)
			return true
	}
})