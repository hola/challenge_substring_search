//Gregg Jansen Van Vüren
//vurentjie@gmail.com
exports.substring_search = (function() {

  var stash = {},
    stash_max = 100;

  return function(needles, haystack) {

    if (!needles.length) return {};

    var ret = {},
      copy_needles = [],
      pat_needles,
      sanity = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,
      key, rgx, found, i, j, pat, x, y,
      stash_keys = Object.keys(stash),
      pipe = [String.fromCharCode(1), /\x01/g, '|'],
      left_paren = [String.fromCharCode(2), /\x02/g, '('],
      right_paren = [String.fromCharCode(3), /\x03/g, ')'],
      missed_matches = '$1' + left_paren[0] + '$2' + right_paren[0],
      pat_leading = '^(' + left_paren[0] + '*)(',
      pat_trailing = ')';

    for (i = 0, j = needles.length; i < j; i++) {
      if (!needles[i].length) {
        continue;
      }
      if (!(needles[i] in ret)) {
        if (needles[i].length > haystack.length) {
          ret[needles[i]] = 0;
        } else {
          copy_needles.push(needles[i]);
          ret[needles[i]] = 0;
        }
      }
    }

    key = copy_needles.sort(function(a, b) {
      return a.length > b.length ? -1 : 1;
    }).join(pipe[0]);

    if (stash[key]) {

      rgx = stash[key];

    } else {

      j = copy_needles.length;
      pat_needles = new Array(j);

      for (i = 0; i < j; i++) {
        pat = new RegExp(pat_leading + copy_needles[i].replace(sanity, "\\$&") + pat_trailing);
        for (x = 0; x < i + 1; x++) {
          pat_needles[x] = (pat_needles[x] || copy_needles[x]).replace(pat, missed_matches);
        }
      }

      rgx = new RegExp(
        pat_needles.join(pipe[0]).replace(sanity, "\\$&")
        .replace(left_paren[1], left_paren[2])
        .replace(right_paren[1], right_paren[2])
        .replace(pipe[1], pipe[2]), 'g');

      if (stash_keys.length > stash_max) {
        delete[stash_keys[new Date() % stash_max]];
      }
      stash[key] = rgx;

    }

    while (found = rgx.exec(haystack)) {
      for (i = 1, j = found.length; i < j; i++) {
        if (found[i]) {
          ++ret[found[i]];
        }
      }
      rgx.lastIndex = found.index + 1;
    }

    return ret;

  };

})();