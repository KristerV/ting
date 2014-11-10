G = {
	notify: function(text) {

		if (!Session.get("windowHidden")) {
			return false
		}

		// Notification sound
		var lastNotification = Session.get("lastNotification")
		var timeout = 1000 * 10
		if (_.isUndefined(lastNotification) || lastNotification + timeout < Date.now()) {
			var audio = new Audio('sound/chirp.mp3')
			audio.play()
		}
		Session.set("lastNotification", Date.now())

		Notification.requestPermission( function(status) {
			var n = new Notification("Ting.ee", {body: text, tag: "ting", icon: "icon/ting_32.png"})
			n.onshow = function () { 
				setTimeout(n.close.bind(n), 4000);
			}
			n.onclick = function (e) {
			    window.focus();
			};
		});
	},
}