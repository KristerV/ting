Template.menuItem.helpers({
	hasAccess: function() {
		var userId = this._id
		var circle = CircleCollection.findOne(Session.get('module').id)
		if (!isset(circle) || !isset(circle.hasAccess))
			return false

		if (_.contains(circle.hasAccess, userId))
			return true
	},
	isUnread: function() {
		var obj

		// 4eyes chat needs different approach
		if (!_.isUndefined(this.username))
			obj = CircleCollection.findOne(Chat.get4eyesId(this._id))
		else
			obj = this

		// Probably 4eyes chat - never talked to this person before
		if (!isset(obj))
			return false

		var lastChange = null
		if (obj.module == 'wiki') {
			// Get last change date
			if (!isset(obj.content) || obj.content[obj.content.length-1].timestamp)
				lastChange = obj.content[obj.content.length-1].timestamp
		} else { // must be chat
			// Get last message date
			if (isset(obj.messages) && obj.messages[obj.messages.length-1].timestamp)
				lastChange = obj.messages[obj.messages.length-1].timestamp
		}

		// Get last seen
		var lastSeen = null
		if (isset(obj.lastSeen) && isset(obj.lastSeen[Meteor.userId()]))
			lastSeen = obj.lastSeen[Meteor.userId()]

		return lastChange > lastSeen
	},
	userStatus: function() {

		if (isset(this.username)) {
			var user = Meteor.users.findOne(this._id)
			if (isset(user) && isset(user.status) && user.status.online === true) {
				return 'u-green'
			}
		}
		return 'u-transparent'
	},
	isLimited: function() {
		if (!isset(this.username))
			return false

		if (isset(this.profile) && isset(this.profile.access) && this.profile.access !== 'limited')
			return false

		return true
	},
	myFriend: function() {
		return true
	}
})
Template.menuItem.events({
	'click .menuItem': function(e, tmpl) {
		var idCurrentUser = Meteor.userId()
		var idTarget = e.currentTarget.id

		// "Give person access to circle" mode
		var toggleCircleId = Session.get('toggleAccessToCircle')
		if (isset(toggleCircleId)) {

			// Only works on people
			if (!$(e.delegateTarget).hasClass('people')) {
				Session.set('toggleAccessToCircle', null)
				return false
			}

			// If it's the first access to be given
			if (!isset(CircleCollection.findOne(toggleCircleId)['hasAccess']))
				CircleCollection.update(toggleCircleId, {$set: {hasAccess: []}})

			// Give or take access
			var accessArray = CircleCollection.findOne(toggleCircleId)['hasAccess']
			if (_.contains(accessArray, idTarget))
				CircleCollection.update(toggleCircleId, {$pull: {hasAccess: idTarget}})
			else
				CircleCollection.update(toggleCircleId, {$push: {hasAccess: idTarget}})

			// Stop further execution
			return true
		}

		// Ok, really dealing with changing the module now
		Global.bigBlur()

		// Change module contents
		var module = $(e.currentTarget).attr('module')
		var type = $(e.currentTarget).attr('type')

		// Act different in case of 4eyes chat
		if (type == '4eyes') {

			// Id of a 4eyes chat is userId1+userId2
			idCircle = Chat.get4eyesId(idTarget)

			// if circle doesn't exist, make it exist
			var circle = CircleCollection.findOne(idCircle)
			if (!isset(circle)) {
				var name_current = Meteor.users.findOne(idCurrentUser).username
				var name_other = Meteor.users.findOne(idTarget).username
				var name_both = name_current + " " + Translate('and') + " " + name_other
				CircleCollection.insert({_id: idCircle, topic: name_both, type: "4eyes"})
			}

		} else {
			idCircle = idTarget
		}
		
		Session.set('module', {module: module, id: idCircle})
	},
})