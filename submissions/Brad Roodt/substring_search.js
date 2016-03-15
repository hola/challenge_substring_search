'use strict';

module.exports = function (substrings, text) {

  if (!Array.isArray(substrings)) throw new TypeError('Substrings must be an array');
  if (typeof text !== 'string') throw new TypeError('Text must be a string');
  if (substrings.length > 100) throw new RangeError('Can only search for up to 100 substrings');
  let t, c, substring, i, output;
  output = {};
  t = substrings.length;
  for (; t; t--) {
    substring = substrings[t - 1];
    if (output[substring]) continue;
    if (typeof substring !== 'string') throw new TypeError('Substring must be a string');
    if (!substring.length || substring.length > 100) throw new RangeError('Substring must be between 1 & 100 characters in length');
    c = 0;
    i = text.indexOf(substring);
    if (i !== -1) {
      for (; i <= text.length;) {
        c++;
        i = text.indexOf(substring, i + 1);
      }
    }
    output[substring] = c;
  }
  return output;

};