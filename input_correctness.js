var assert = require('assert');
exprots.substring_search_validate = function(substrings, text){
    assert(Array.isArray(substrings));
    assert(substrings.length<=100);
    substrings.forEach(s=>{
        assert(typeof s=='string');
        assert(s.length<=100);
        assert(/^[\x20-\x7f]*$/.test(s));
    });
    assert(typeof text=='string');
    assert(/^[\x20-\x7f]*$/.test(text));
};
