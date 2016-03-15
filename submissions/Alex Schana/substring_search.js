exports.substring_search = function (substrings, text) {
    var result = {};

    var i = Array.isArray(substrings) ? substrings.length : 0;
    while (i--) {
        var term = substrings[i],
            re = new RegExp(term, "g"),
            count = 0;

        while (re.test(text)) {
            count++;
        }
        result[term] = count;
    }

    return result;
}