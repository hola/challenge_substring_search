/**
 * @author Brian Danley<danleyb2@gmail.com>
 */

/**
 * Counts the number of occurrences of substrings in a string.
 *
 * @param substrings Array
 * @param text  String
 * @returns {{}}
 */
exports.substring_search = function(substrings, text){
    var response = {};
    for (var i = substrings.length - 1; i >= 0; i--) {
        var n = 0,
            currentPosition = 0;

        while (
        (currentPosition < text.length-substrings[i].length) &&
        (currentPosition=text.indexOf(substrings[i], currentPosition)+1)
            )++n;

        response[substrings[i]] = n;
    }
    return response;
};