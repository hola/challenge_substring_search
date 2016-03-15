/**
 * Created by Abdul on 2/13/2016.
 * For: Hola substring_search challenge (https://github.com/hola/challenge_substring_search)
 * Implementing substring search using native JS
 */

/**
 * substring_search: Searches and counts occurrences of substrings in a string
 * @param substrings Array
 * @param text String
 * @return result Object
 */
exports.substring_search = function (substrings, text) {
    var result = {}, i = substrings.length, element = '', position = 0, counter = 0;
    while (i--) {
        element = substrings[i];
        counter = 0;
        if (element.length === 0) { //Skip blank substrings - Improves worse case scenario
            position = -1;
        } else {
            position = text.indexOf(element);
        }
        while (position !== -1) {
            counter++;
            position = text.indexOf(element, position + element.length); //Safe to hop substring to speed things up
        }
        result[element] = counter;
    }
    return result;
}