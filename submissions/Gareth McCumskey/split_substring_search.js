exports.substring_search = function(substrings, text) {
  var res = {};
  substrings.forEach(s=>{
    res[s] = 0;
    var split_string = text.split(s);
    res[s] = split_string.length - 1;
  });

  return res;
}