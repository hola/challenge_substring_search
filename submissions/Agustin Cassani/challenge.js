exports.substring_search = function (substrings, text) {
    var result = {};

for (var ss in substrings) {
        var current = substrings[ss];
var pattern = new RegExp(current, 'g');
result[current] = text.match(pattern) ? text.match(pattern).length : 0;
}

    return result;
};
