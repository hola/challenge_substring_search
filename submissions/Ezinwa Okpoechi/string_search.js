  
function boyermore(disgust, line) {
    var suffixes = failure(disgust);
    var registry = 0;
    var j = 0;
    var i = 0;
    while (i < line.length) {
        if (line.charAt(i) === disgust.charAt(j)) {
            i++;
            j++;
        }
        if (j === disgust.length) {
            registry++;
            j = suffixes[j-1];
        }
        else if (line.charAt(i) !== disgust.charAt(j)) {
            if (j !== 0) {
                j = suffixes[j-1];
            } else {
                i++;
            }
        }
    }
    return registry;
}
function failure(line) {
    var mapper = new Array(line.length);
    var L = 0;
    mapper[0] = 0;
     for (var i = 1; i < line.length; i++) {
        while (L > 0 && line.charAt(i) !== line.charAt(L)) {
            L = mapper[L - 1];
        }
        if (line.charAt(L) === line.charAt(i)) {
            L++;
        }
    mapper[i] = L;
        }
    return mapper;
}            
    exports.substring_search = function caller(substrings, text){
        var returner = {};
        for(var i = 0; i < substrings.length; i++)returner[substrings[i]] = 0;
        for (var i = 0; i < substrings.length; i++) {
            var registry = boyermore(substrings[i], text);
            returner[substrings[i]] = returner[substrings[i]] + registry;
        }
        return returner;
    }

 