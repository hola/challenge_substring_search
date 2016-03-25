#!/usr/bin/env node
'use strict';
const path = require('path');
const assert = require('assert');
const large = path.dirname(process.argv[1])+'/large.json';

function import_fn(target){
    let script = require(path.resolve(target));
    if (typeof script.substring_search=='function')
        return script.substring_search;
    if (typeof script=='function')
        return script;
    let exported = Object.keys(script);
    if (exported.length==1 && typeof script[exported[0]]=='function')
        return script[exported[0]];
    throw new Error('Function substring_search not found');
}

function main(target){
    let test = require(large);
    let start = Date.now();
    let fn = import_fn(target);
    let res = fn(test.needles, test.haystack);
    let end = Date.now();
    assert.deepStrictEqual(res, test.result);
    console.log(end-start);
}

main(process.argv[2]);
