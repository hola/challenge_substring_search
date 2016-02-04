var assert = require('assert');
exprots.valid_input = function(substrings, text){
    assert(typeof text=='string');
    assert(/^[\x20-\x7f]*$/.test(text));
    assert(Array.isArray(substrings));
    assert(substrings.length<=100);
    var dup = {};
    substrings.forEach(s=>{
        assert(typeof s=='string');
        assert(s.length>0 && s.length<=100);
        assert(/^[\x20-\x7f]*$/.test(s));
        assert(!dup[s]);
        dup[s] = true;
    });
};
