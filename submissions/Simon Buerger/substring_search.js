'use strict'

function get_occurences(searchFor, searchIn) {
  let startAt = searchIn.indexOf(searchFor, 0) + 1
  if (!startAt) return 0

  for (var count = 1;startAt = searchIn.indexOf(searchFor, startAt) + 1;) {
    count++
  }
  return count
}

 function substring_search(substrings, searchIn) {
  let results = {},
      substring
  for (let l = substrings.length;l--;) {
    substring = substrings[l]
    results[substring] = get_occurences(substring, searchIn)
  }
  return results
}


exports.substring_search = substring_search
