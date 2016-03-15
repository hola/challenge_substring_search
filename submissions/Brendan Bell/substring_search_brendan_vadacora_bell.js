'use strict'

/**
*Function that returns a js object of a key value pair of each given substring as the key and its number of occurrences as the value.
*@param substrings : Array of substrings to search for
*@param text : String where the substrings will be searched for
*@returns js object of key value pairs for each substring along with its number of occurrences
**/
var substring_search = function(substrings, text){
    
	//define the js obj to assign key value pairs to
    var result = {};
    
    //loop on each element of array
    substrings.forEach(function(element){
        
        //define result key
        result[element] = 0;
        
        //iterate over text length
        for(var i = 0; i < text.length;){
            
            //find index of element starting at text index
            var pos = text.indexOf(element, i)
            
            if(pos > -1){
                
                //increment result at key of element
                result[element]++;
                
                //assign i to the position found + 1 to avoid matching the same position
                i = pos+1;
                
            }
            else{
                
                //increment i by 1 to continue search
                i++;
                
            }
            
        }
        
        
    });
    
    //return the jso for this function expression
    return result;

}