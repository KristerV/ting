isset = function(data) {
	if (data == false)
		return false;

	if (!data)
		return false;

	if (typeof(data) == 'undefined')
		return false;

	if (data == 'undefined')
		return false;

	if (data.length == 0)
		return false;

	if (typeof(data) == 'object' && _.isEmpty(data))
		return false;
	
	return true;
}