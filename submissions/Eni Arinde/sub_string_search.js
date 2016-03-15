'use strict';
function numOccur(string, subString) {
    if (subString.length <= 0) return 0;
    string += "";
    subString += "";

    var n = 0,
        pos = 0,
        step = subString.length;

    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            n++;
            pos += step;
        } else break;
    }
    return n;
}

function subStringSearch(array_strings, string) {
  var array_length = array_strings.length,
      hash = {};

  for (var i = 0; i < array_length; i++) {
    var subString = array_strings[i];
    hash[subString] = numOccur(string, subString);
  }
  return hash;
}

module.exports = subStringSearch;