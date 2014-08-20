Template.circle.helpers({
	messages: function() {
		var circle = TalkingCircles.findOne(Session.get('circleTopic'))
		Meteor.setTimeout(function(){
			$('.circle .messages').scrollTop($('.circle .messages')[0].scrollHeight)
		}, 1)
		return isset(circle) ? circle.messages : null;
	},
	username: function() {
		var user = Meteor.users.findOne(this.userid)
		return isset(user) ? user.username : null
	},
	circle: function() {
		var circle = TalkingCircles.findOne(Session.get('circleTopic'))
		if (!isset(circle))
			return null

		if (circle['type'] == 'open')
			circle['typeEst'] = 'avatud'
		else if (circle['type'] == '4eyes')
			circle['typeEst'] = 'kahekõne'
		else if (circle['type'] == 'closed')
			circle['typeEst'] = 'suletud'

		if (circle['author'])
			circle['authorName'] = Meteor.users.findOne(circle['author']).username

		return circle
	},
	topicAuthor: function() {
		return this.author == Meteor.userId()
	},
	changeType: function() {
		return this.type != '4eyes' && this.author == Meteor.userId()
	},
})

Template.circle.events({
	'submit form[name=circleinput]': function(e, tmpl) {
		e.preventDefault()
		TalkingCircle.bigBlur()
		var data = getFormData('form[name=circleinput]')
		if (!data.msg)
			return false
		data['userid'] = Meteor.userId()
		data['timestamp'] = Date.now()
		data['_id'] = generateHash()
		TalkingCircles.update(Session.get('circleTopic'), {$push: {messages: data}})
		$('form[name=circleinput] input[name=msg]').val('')
	},
	'click .type': function(e, tmpl) {
		TalkingCircle.bigBlur()
		var _id = Session.get('circleTopic')
		var circleType = TalkingCircles.findOne(_id).type
		if (circleType == 'closed')
			TalkingCircles.update(_id, {$set: {type: 'open'}})
		if (circleType == 'open')
			TalkingCircles.update(_id, {$set: {type: 'closed'}})
	},
	'click .topic': function(e, tmpl) {
		TalkingCircle.editTopic()
		TalkingCircle.bigBlur()
	},
	'submit form[name=edittopic]': function(e, tmpl) {
		e.preventDefault()
		TalkingCircle.doneEditingTopic()
		TalkingCircle.bigBlur()
	},
	'blur form[name=edittopic] input': function(e, tmple) {
		TalkingCircle.doneEditingTopic()
	},
	'click .delete': function(e, tmpl) {
		TalkingCircle.bigBlur()
		var confirmation = confirm("Lõpetame ringi?")
		if (confirmation) {
			TalkingCircles.remove(Session.get('circleTopic'))
			Session.set('circleTopic', 'maincircle')
		}
	},
	'click .invite-start': function(e, tmpl) {
		Session.set('selectUsers', true)
		$('.invite-start, .invite-selected').toggleClass('hidden')
	},
	'click .invite-selected': function(e, tmpl) {
		Session.set('selectUsers', null)
		$('.invite-start, .invite-selected').toggleClass('hidden')
		var data = getFormData('form[name=userlist]')
		var users = data.users
		TalkingCircles.update(Session.get('circleTopic'), {$push: {inCircle: data.users}})
	},
})

Template.circle.rendered = function() {
	TalkingCircle.resizeMessages()
}

TalkingCircle = {
	editTopic: function(){
		var _id = Session.get('circleTopic')
		var topic = TalkingCircles.findOne(_id).topic
		$('.circle .topic.small-button').css('display', 'none').after('\
																	<form name="edittopic">\
																		<input name="topic" type="text">\
																		<input type="submit" value="salvesta">\
																	</form>')
		$('form[name=edittopic] input[type=text]').val(topic).focus().select()
		Meteor.flush()
	},
	doneEditingTopic: function() {
		var _id = Session.get('circleTopic')
		var data = getFormData('form[name=edittopic]')
		TalkingCircles.update(_id, {$set: data})
		$('form[name=edittopic]').remove()
		$('.circle .topic.small-button').css('display', 'inline-block')
	},
	bigBlur: function() {
		Session.set('selectUsers', null)
	},
	resizeMessages: function() {
		// Set circle messages height
		Meteor.setTimeout(function(){
			var wrapperHeight = $('.circle').height()
			var othersHeight = $('.circle .title').height() + $('.circle form[name=circleinput]').outerHeight()
			var remainingHeight = wrapperHeight - othersHeight
			$('.circle .messages').height(remainingHeight)
		}, 1)
	}
}