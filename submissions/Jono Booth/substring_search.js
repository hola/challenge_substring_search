exports.substring_search = function(substrings, text){
	var res = {};
	substrings.slice(0,100).forEach(function(s){
		res[s] = text.match(new RegExp( s, 'g' ) || []).length
	});
	return res;
}