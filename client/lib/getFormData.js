getFormData = function(selector, acceptEmptyFields) {
	var data = {};

	$(selector).serializeArray().forEach(function(obj){
		if (obj.value || acceptEmptyFields !== true) {
			if (isset(data[obj.name])) {
				if ($.isArray(data[obj.name])) {
					data[obj.name].push(obj.value)
				} else {
					data[obj.name] = [data[obj.name], obj.value]
				}
			} else {
				data[obj.name] = obj.value;
			}
		}
	});

	return data;
}
