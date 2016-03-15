exports.substring_search = function(substrings, text){
    var result = {};
    substrings.forEach( needle =>{
        result[needle] = ( text.match( new RegExp( needle.replace( /(?=[\/\\^$*+?.()|{}[\]])/g, "\\"), "g") ) || [] ).length;
    });
    return result;
};