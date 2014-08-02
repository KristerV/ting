Template.messages.helpers({
	messages: function() {
		return Messages.find()
	},
	aho: function() {
		return isset(this.aho.length) ? this.aho.length : false
	},
	style: function() {
		if ($.inArray(Session.get("username"), this.aho) > -1)
			return "background-color: rgba(0,255,0,0.3); -webkit-border-radius: 10px; border-radius: 10px; border: 1px solid rgba(0,0,0,0.3)"
	}
})

Template.messages.events({
	'click .line': function(e, tmple) {
		if (!isset(Session.get('username')))
			return false
		var msg = Messages.findOne(e.currentTarget.id)
		if ($.inArray(Session.get("username"), msg.aho) > -1)
			Messages.update(e.currentTarget.id, {$pull: {aho: Session.get("username")}})
		else
			Messages.update(e.currentTarget.id, {$push: {aho: Session.get("username")}})
	}
})