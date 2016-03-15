/*

 Author: Justin Lovell <justin@justjuzzy.com>

 */

'use strict';

exports.substring_search = function(substrings, text) {
    if (!Array.isArray(substrings)) {
        throw Error('Parameter substrings is not an array');
    }
    if (typeof text === 'string') {
        text = new Buffer(text, 'ascii');
    }
    if (!Buffer.isBuffer(text)) {
        throw Error('Parameter text is not a string nor a buffer');
    }

    var result = {};

    substrings.map(function(substring) {
        var foundCounter = 0;
        var pos = -1;

        do {
            pos = text.indexOf(substring, pos + 1);

            if (pos >= 0) {
                foundCounter++;
            }
        } while (pos >= 0);

        result[substring] = foundCounter;
    });

    return result;
};


