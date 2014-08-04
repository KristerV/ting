// Generate userId if none
if (!isset(localStorage.getItem("userId")))
	localStorage.setItem("userId", generateHash());
