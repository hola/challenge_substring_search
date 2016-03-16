exports.substring_search = function(substrings, text){
    var res = {},i = substrings.length;
    while(i--){
    	res[substrings[i]] = text.split(substrings[i]).length - 1;
    }
    return res;
};