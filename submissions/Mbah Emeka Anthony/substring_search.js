exports.substring_search = function(substrings, text){
    var result = {};
    var regxp;
    for (var i = 0; i < substrings.length; i++)
    {
        regxp = new RegExp(substrings[i], 'g');
        result[substrings[i]] = (text.match(regxp) || []).length;
    }
    return result;
};