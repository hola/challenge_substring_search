// You can call the function below as follow.
// val substringArray = ["String01", "String02", "String03", "String04"];
// val response = textContentString.substring_search( substringArray )

String.prototype.substring_search = function(substringArray) {
  var textContent = this.valueOf();
  var result = { };
  for (var i = 0 ,l = substringArray.length; i < l; ++i) {
    var singleValue = substringArray[i];
    result[singleValue] = (textContent.match(new RegExp(singleValue,"g")) || []).length
  }
  return JSON.stringify(result);
};

