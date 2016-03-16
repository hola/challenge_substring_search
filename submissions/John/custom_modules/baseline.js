exports.substring_search = function(substrings, text){
    var res = {};
    substrings.forEach(s=>{
        res[s] = 0;
        for (var i=0; i<text.length; i++)
        {
            if (text.slice(i, i+s.length)==s)
                res[s]++;
        }
    });
    return res;
};