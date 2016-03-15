
exports.substring_search = function(substrings, text){
    // after assert
    var res = {};
    substrings.forEach(sub=>{
        res[sub] = text.match(new RegExp(sub), 'g').length;
    });
    return res;
};

