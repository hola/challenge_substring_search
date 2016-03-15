exports.substring_search_v1 = function(substrings, text){
    var res = {};

    substrings.forEach(s=>{
        if (text.match(s)){
            var re = "((?=" + s + "))";
            regex = new RegExp(re, 'g');
            res[s] = text.match(regex).length;
        }
        else{
            res[s] = 0;
        }
    });
    return res;
};