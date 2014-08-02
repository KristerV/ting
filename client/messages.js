Template.messages.helpers({
	messages: function() {
		return Messages.find({}, {sort: {timestamp: 1}})
	},
	aho: function() {
		return isset(this.aho.length) ? this.aho.length : false
	},
	style: function() {
		if ($.inArray(localStorage.getItem('userId'), this.aho) > -1)
			return "background-color: rgba(0,255,0,0.3); -webkit-border-radius: 10px; border-radius: 10px; border: 1px solid rgba(0,0,0,0.3)"
	}
})

Template.messages.events({
	'click .line': function(e, tmple) {
		var msg = Messages.findOne(e.currentTarget.id)
		if ($.inArray(localStorage.getItem('userId'), msg.aho) > -1)
			Messages.update(e.currentTarget.id, {$pull: {aho: localStorage.getItem('userId')}})
		else {
			$('.aho-wrapper').fadeIn(400).promise().done(function(){$('.aho-wrapper').fadeOut(1000) })
			Messages.update(e.currentTarget.id, {$push: {aho: localStorage.getItem('userId')}})
		}
	}
})