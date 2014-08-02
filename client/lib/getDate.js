getDate = function() {
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();
	var h = today.getHours();
	var min = today.getMinutes();

	// if(dd<10) {
	//     dd='0'+dd
	// } 

	if(mm<10) {
	    mm='0'+mm
	} 

	today = h + ':' + min + ' / ' + dd+'.'+mm+'.'+yyyy;
	return today;
}