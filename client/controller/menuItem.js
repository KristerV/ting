Template.menuItem.events({
	'click .menuItem': function(e, tmpl) {
		var module = $(e.currentTarget).attr('module')
		var type = $(e.currentTarget).attr('type')
		var idCurrentUser = Meteor.userId()
		var idTarget = e.currentTarget.id

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




	}
})