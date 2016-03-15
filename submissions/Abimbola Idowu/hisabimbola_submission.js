'use strict';

exports.substring_search = function(substrings, text) {

  var res = {};
  for (var q = 0; q < substrings.length; q++) {
    var currentVal = substrings[q];
    res[currentVal] = 0;
    var re = new RegExp(currentVal, 'g');
    var occurence = text.match(re);
    if (occurence) {
      res[currentVal] = occurence.length;
    }
  }
  return res;
};
