function escapeRegExp(string){
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

exports.substring_search = function(subStrings, text) {
  var results = {},
      wordCount = subStrings.length,
      escapedText = escapeRegExp(text);

  for (var i = 0; i < wordCount; i++) {
    Object.assign(
      results,
      { [subStrings[i]]: escapedText.match(new RegExp('(?:' + escapeRegExp(subStrings[i]) + ')', 'gm')).length }
    );
  }

  return results;
};

