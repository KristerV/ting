UserStatus.events.on("connectionLogout", function(fields) {
	var userId = fields.userId
	var editingWikiDocs = WikiCollection.find({editing: userId}).fetch()
	_.each(editingWikiDocs, function(doc) {
		WikiCollection.update(doc._id, {$set: {editing: ''}})
	})
})