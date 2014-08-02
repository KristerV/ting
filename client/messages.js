Template.messages.helpers({
	messages: function() {
		return Messages.find()
	},
	aho: function() {
		return this.aho.length
	},
	style: function() {
		console.log($.inArray(Session.get("username"), this.aho))
		if ($.inArray(Session.get("username"), this.aho) > -1)
			return "background-color: rgba(0,255,0,0.3); -webkit-border-radius: 10px; border-radius: 10px; border: 1px solid rgba(0,0,0,0.3)"
	}
})

Template.messages.events({
	'click .line': function(e, tmple) {
		Messages.update(e.currentTarget.id, {$push: {aho: Session.get("username")}})
	}
})