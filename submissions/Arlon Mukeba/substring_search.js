exports.substring_search = function(substrings, text){
	var search_result = {};
    substrings.forEach(s=>{
        search_result[s] = 0;
        var i=0;
        var index=-1;
        while(i<text.length)
        {
            index=text.indexOf(s, i);
            if (index>-1)
            {
                search_result[s]++;
                i=index+s.length-1;
            }
            i++;
        }
    });
    return search_result;
}