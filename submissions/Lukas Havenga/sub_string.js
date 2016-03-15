/**
 * Created by Lukas Havenga
 */
substring_search = function(conditions, text){
    var searchArray = {};
    var sortedArray = {};
    var aLength = conditions.length;
    for(var a = 0; a < aLength; ++a){
        searchArray[a] = {index: 0, value: conditions[a], count: 0, total: conditions[a].length}
    }
    for (var b = 0, bLength = text.length; b < bLength; ++b) {
        var currentChar = text[b];
        for(var c = 0; c < aLength && currentChar != " "; ++c){
            if(searchArray[c]['value'][searchArray[c]['index']] == currentChar && searchArray[c]['index']+1 == searchArray[c]['total']){
                ++searchArray[c]['count'];
            }else if(searchArray[c]['value'][searchArray[c]['index']] == currentChar){
                ++searchArray[c]['index'];
                continue;
            }
            searchArray[c]['index'] = 0;
        }
    }
    for(var d = 0; d < aLength; ++d){
        sortedArray[searchArray[d]['value']] = searchArray[d]['count'];
    }
    return sortedArray;
};

substring_search(['gsm', 'phone', 's', 'm-p'], 'gsm-phones: Using a GSM phone in USA may be problematic');
