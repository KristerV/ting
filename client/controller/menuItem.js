Template.menuItem.helpers({
	hasAccess: function() {
		var userId = this._id
		var circle = CircleCollection.findOne(Session.get('module').id)
		if (!isset(circle) || !isset(circle.hasAccess))
			return false

		if (_.contains(circle.hasAccess, userId))
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