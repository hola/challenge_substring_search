#!/usr/bin/env node
'use strict';
const path = require('path');
const fs = require('fs');
const random_js = require('random-js');
const sentence_generator = require('sentence-generator');
const reference = require('./reference.js');

const seed = 9001;
const random = new random_js(random_js.engines.mt19937().seed(seed));
const shakespeare = path.dirname(process.argv[1])+'/shakespeare.txt';
Math.random = ()=>random.real(0, 1);

function main(){
    let f = fs.readFileSync(shakespeare);
    let haystack = '', c;
    for (let b of f)
    {
        if (b > 0x7f)
            continue;
        if (b <= 0x20)
        {
            if (c==' ')
                continue;
            c = ' ';
        }
        else
            c = String.fromCharCode(b);
        haystack += c;
    }
    haystack = haystack.toLowerCase();
    let generator1 = sentence_generator({file: shakespeare});
    let generator2 = sentence_generator({file: shakespeare, count: 50});
    let needles = new Array(100);
    for (let i = 0; i<needles.length; i++)
    {
        let type = random.integer(0, 2);
        switch (type)
        {
        case 0: // short Markov chains
            needles[i] = generator1().toLowerCase();
            break;
        case 1: // long Markov chains
            let str;
            do { str = generator2().slice(0, 100); } while (str.length<20);
            needles[i] = str.toLowerCase();
        case 2: // actual substrings
            let len = random.integer(1, 100);
            needles[i] = haystack.substr(
                random.integer(0, haystack.length-len), len);
            break;
        }
    }
    let result = reference.substring_search(needles, haystack);
    fs.writeFileSync('large.json',
        JSON.stringify({needles, haystack, result}));
}

main();
