CircleCollection.allow({
	update: function (userId, doc, fields, modifier) {
		if (Meteor.users.findOne(userId).profile.access == 'admin')
			return true

		var allowedFields = ['messages', 'lastSeen', 'subscriptions']
		
		// Pushing to messages or setting lastSeen
		if (userId != null && (modifier.$push != null || modifier.$pull != null || modifier.$set != null) && _.difference(fields, allowedFields).length == 0)
			return true

		if (userId === doc.author)
			return true
	},
	remove: function (userId, doc) {

		if (Meteor.users.findOne(userId).profile.access == 'admin')
			return true
		
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
		
		if (Meteor.users.findOne(userId).profile.access == 'admin')
			return true

		// allowed fields before locked check
		var diff = _.difference(fields, ['lastSeen', 'subscriptions'])
		if (diff.length == 0)
			return true

		if (doc.locked)
			return false

		if (doc.editing == userId)
			return true

		if (fields == ['locked'])
			return false

		// allowed fields after locked check
		var allowedFields = ['content', 'editing', 'topic']
		var diff = _.difference(fields, allowedFields)
		if (diff.length == 0)
			return true

		return false
	},
	remove: function (userId, doc) {

		if (Meteor.users.findOne(userId).profile.access == 'admin')
			return true
		
		if (userId === doc.author)
			return true
	},
	insert: function (userId, doc) {
		if (userId != null)
			return true
	}
})

Meteor.users.allow({
	update: function (userId, doc, fields, modifier) {
		if (userId == doc._id && _.difference(fields, ['username']).length == 0)
			return true
	}
})