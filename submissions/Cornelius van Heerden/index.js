exports.substring = function(substrings,text){
	var NewSet = {};
	for (var i = 0; i < substrings.length; i++) {
		NewSet[substrings[i]] = (text.match(RegExp(substrings[i],"g")) || []).length;
	}
	return NewSet;
}