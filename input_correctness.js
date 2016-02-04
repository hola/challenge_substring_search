var assert = require('assert');
exprots.valid_input = function(substrings, text){
    assert(Array.isArray(substrings));
    assert(substrings.length<=100);
    substrings.forEach(s=>{
        assert(typeof s=='string');
        assert(s.length>0 && s.length<=100);
        assert(/^[\x20-\x7f]*$/.test(s));
    });
    assert(typeof text=='string');
    assert(/^[\x20-\x7f]*$/.test(text));
};
