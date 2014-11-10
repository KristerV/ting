G = {
	notify: function(text) {

		if (!Session.get("windowHidden")) {
			console.log("N: hidden")
			return false
		}

		// Notification sound
		console.log("N: sound")
		var lastNotification = Session.get("lastNotification")
		var timeout = 1000 * 10
		if (_.isUndefined(lastNotification) || lastNotification + timeout < Date.now()) {
			console.log("N: sound play")
			var audio = new Audio('sound/chirp.mp3')
			audio.play()
		}
		Session.set("lastNotification", Date.now())

		console.log("N: Bubble")
		Notification.requestPermission( function(status) {
			console.log("N: Bubble show")
			var n = new Notification("Ting.ee", {body: text, tag: "ting", icon: "icon/ting_32.png"})
			n.onshow = function () { 
				console.log("N: Bubble onshow")
				setTimeout(n.close.bind(n), 4000);
			}
			n.onclick = function (e) {
				console.log("N: Bubble onclick")
			    window.focus();
			};
		});
	},
}