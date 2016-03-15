'use strict';

exports.substring_search = function(substrings, text) {
    var results = {};
    for (var i = 0 ; substrings.length > i ; ++i)
        results[substrings[i]] = 0;

    for (var j = 0 ; text.length > j ; ++j) {
        for (var i = 0 ; substrings.length > i ; ++i) {
            var substr = substrings[i];

            var tmpJ = j;
            for (var k = 0 ; substr.length > k ; ++k) {
                if (substr[k] !== text[tmpJ])
                    break ;
                ++tmpJ;
            }
            if (substr.length === k)
                ++results[substr];
        }
    }

    return results;
};
