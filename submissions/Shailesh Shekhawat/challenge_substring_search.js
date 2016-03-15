exports.substring_search = function(substrings, text){
    var obj = {}
    substrings.forEach(s=>{
        obj[s] = text.split(s).length - 1
    })
return obj;
}

