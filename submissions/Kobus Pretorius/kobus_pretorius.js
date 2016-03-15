/**
 * =============================================================================
 * Hola JS Africa Challenge: substring search
 * =============================================================================
 * @author Kobus Pretorius (Centurion, South Africa)
 * @description Count the occurrences of substrings in a large multi-megabyte 
 * text, and return the number of occurrences of each substring in the text, 
 * case-sensitive.
 * @param {Array} substrings
 * @param {String} text
 * @returns {Object}
 */
exports.substring_search = function (substrings, text) {
  var res = {};
  var slength = substrings.length;
  var i = 0;
  for (var i = 0, tlength = text.length; i < slength; i++) {
    var s = substrings[i];
    if (!res.hasOwnProperty(s)) {
      res[s] = (tlength - text.replace(new RegExp(s, 'g'), '').length) / s.length;
    }
  }
  return res;
};
