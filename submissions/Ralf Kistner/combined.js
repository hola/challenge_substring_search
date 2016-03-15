// Plain implementation using indexOf.
// Fast for up to 20-40 patterns.
function indexof(patterns, text) {
    var res = {};
    patterns.forEach(function(s) {
      var last = -1;
      var count = 0;
      while(true) {
        var index = text.indexOf(s, last + 1);
        if(index < 0) {
          break;
        }
        count += 1;
        last = index;
      }
      res[s] = count;
    });
    return res;
};

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

// Implementation based on regular expressions. Faster for lots of patterns.
function regexp(patterns, text) {
    var res = {};
    var normalized = {};
    patterns.forEach(function(pattern) {
      res[pattern] = 0;
      normalized[pattern] = 0;
    });

    // Longest patterns first.
    patterns.sort(function(a, b) {
      return b.length - a.length;
    });

    var restring = '';
    patterns.forEach(function(pattern) {
      restring += '|' + escapeRegExp(pattern);
    });

    // Find all matches
    // The RegExp will attempt to find the longest match first. In that case,
    // substrings of that will not be matched, so we add them later.
    var re = new RegExp(restring.substring(1), 'g');
    while(true) {
      var match = re.exec(text);
      if(!match) {
        break;
      }
      var m = match[0];
      res[m] += 1;
      // Begin next search right after the *start* of the last match.
      re.lastIndex = match.index + 1;
    }


    // If a shorter substring is a prefix of a longer one, the above code
    // only matches the longer one. We compensate for this.
    patterns.forEach(function(pattern) {
      normalized[pattern] = res[pattern];
    });

    patterns.forEach(function(pattern) {
      var result = res[pattern];
      for(var i = 0; i < pattern.length; i++) {
        var prefix = pattern.substring(0, i);
        if(prefix in res) {
          normalized[prefix] += result;
        }
      }
    });

    return normalized;
};

exports.substring_search = function(patterns, text) {
  // Combined version. Simple heuristic to guess the best one to use.
  if(patterns.length <= 30) {
    return indexof(patterns, text);
  } else {
    return regexp(patterns, text);
  }
};
