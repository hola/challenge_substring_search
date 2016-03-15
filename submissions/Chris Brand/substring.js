function suffixes (needle)
{
    var n = needle.length;
    var g = n - 1;
    var f = 0;

    var suffixes = [];
    suffixes[n - 1] = n;

    for (var i = n - 2; i >= 0; i--) {
        if (i > g && suffixes[i + n - 1 - f] < i - g) {
            suffixes[i] = suffixes[i + i - 1 - f];
        } else {

            if (i < g) g = i;
            f = i;

            while (g >= 0 && needle[g] == needle[g + n - 1 - f]) {
                g--;
            }

            suffixes[i] = f - g;
        }
    }

    return suffixes;
}

function badCharacters(needle)
{
   var n = needle.length;
   var badChars = {};

   for (var i = 0; i < n - 1; i++) {
      badChars[needle[i]] = n - i - 1;
   }

   return badChars;
}


function goodSuffixes(needle)
{
    var n = needle.length;
    var suff = suffixes(needle);
    var goodSuffixes = [];

    for (var i = 0; i < n; i++) {
        goodSuffixes[i] = n
    }

    for (i = n - 1; i >= 0; i--) {
        if (suff[i] == i + 1) {
            for (var j = 0; j < n - i - 1; j++) {
                if (goodSuffixes[j] == n) goodSuffixes[j] = n - i - 1;
            }
        }
   }

   for (i = 0; i < n - 2; i++) {
        goodSuffixes[n - 1 - suff[i]] = n - i - 1;
   }

   return goodSuffixes;
}


function match(needle, haystack)
{
    var n = haystack.length;
    var m = needle.length;

    var goodSuff = goodSuffixes(needle);
    var badChars = badCharacters(needle);
    var matches = 0;

    var j = 0;
    while (j < n - m) {
        for (var i = m - 1; i >= 0 && needle[i] == haystack[i + j]; i--);

        if (i < 0) {
            matches++;
            j += goodSuff[0];
        } else {

            if (typeof badChars[haystack[i + j]] !== 'undefined') {
                var badCharIndex = badChars[haystack[i + j]] - m + i + 1;
            } else {
                var badCharIndex = 0;
            }

            j += Math.max(goodSuff[i], badCharIndex);
        }
    }

    return matches;
}

function substr(substrings, text) {
    var res = {};

    substrings.forEach(function (string) {
        res[string] = match(string, text);
    });

    return res;
}

exports.substring_search = substr;