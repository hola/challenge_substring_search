// Author: Nolan Pather

'use strict';

exports.substring_search = function substringSearch(substrings, text) {
    var result = {};
    for (var i = 0; i < substrings.length; i++) {
        var idx = text.indexOf(substrings[i]);
        var count = 0;
        while (idx >= 0) {
            count++;
            idx = text.indexOf(substrings[i], idx + 1);
        }
        result[substrings[i]] = count;
    }
    return result;
};

exports.btree = function btree(text) {
    var tree = {};
    tree[text] = 1;
    return tree;
};
