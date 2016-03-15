/**
 *
 * Copyright (c) 2016 cr1s.
 * Some rights reserved.
 *
 * @module hola/challenge_substring_search
 */

'use strict';

function substring_count(string, text) {
  var n = 0, pos = 0

  while ((pos = text.indexOf(string, pos)) > -1) {
    pos++
    n++
  }

  return n
}

module.exports = function substring_search(strings, text) {
  var res = {}, n = strings.length

  while (n--)
    res[strings[n]] = substring_count(strings[n], text)

  return res
}

