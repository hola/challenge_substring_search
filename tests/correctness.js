#!/usr/bin/env node
'use strict';
const assert = require('assert');
const fs = require('fs');
const vm = require('vm');
const util = require('util');

const tests = {
    readme1: {
        needles: ['gsm', 'phone', 's', 'm-p'],
        haystack: '',
        expected: {gsm: 0, phone: 0, s: 0, 'm-p': 0},
    },
    readme2: {
        needles: ['gsm', 'phone', 's', 'm-p'],
        haystack: 'gsm-phones: Using a GSM phone in USA may be problematic',
        expected: {gsm: 1, phone: 2, s: 3, 'm-p': 1},
    },
    empty: {
        needles: [],
        haystack: '',
        expected: {},
    },
    empty_needles: {
        needles: [],
        haystack: 'xyzzy',
        expected: {},
    },
    no_matches: {
        needles: ['foo'],
        haystack: 'xyzzy',
        expected: {foo: 0},
    },
    longer: {
        needles: ['foobar'],
        haystack: 'foo',
        expected: {foobar: 0},
    },
    exact: {
        needles: ['foobar'],
        haystack: 'foobar',
        expected: {foobar: 1},
    },
    case: {
        needles: ['A', 'a'],
        haystack: 'AaAa',
        expected: {A: 2, a: 2},
    },
    special: {
        needles: ['\\', '/', '.', '*', '+', '?', ' ', '^', '$', '|', '[', ']',
            '(', ')', '-', '{', '}', '"', "'", '~', '\x7f'],
        haystack: '\\/.*+? ^$|[]()-{}"\'~\x7f\\/.*+? ^$|[]()-{}"\'~\x7f',
        expected: {'\\': 2, '/': 2, '.': 2, '*': 2, '+': 2, '?': 2, ' ': 2,
            '^': 2, '$': 2, '|': 2, '[': 2, ']': 2, '(': 2, ')': 2, '-': 2,
            '{': 2, '}': 2, '"': 2, "'": 2, '~': 2, '\x7f': 2},
    },
    overlap1: {
        needles: ['aaa', 'aa', 'a'],
        haystack: 'aaaaa',
        expected: {aaa: 3, aa: 4, a: 5},
    },
    overlap2: {
        needles: ['foo', 'oob', 'oba', 'bar'],
        haystack: 'foobar',
        expected: {foo: 1, oob: 1, oba: 1, bar: 1},
    },
};

var warnings = true;

function compile(filename){
    try {
        let text = fs.readFileSync(filename, 'utf8');
        return new vm.Script(text, {filename: filename});
    } catch(e){
        console.log(e.message);
        throw e;
    }
}

function run_search(script, needles, haystack, expected){
    const id = '__hola_xyzzy__';
    let m = {exports: {}};
    let context = vm.createContext({
        module: m,
        exports: m.exports,
        Buffer,
        console: {log(){}},
    });
    context.global = context;
    Object.defineProperty(context, id, {value: vm.runInContext(
        '('+JSON.stringify({needles, haystack})+')', context)});
    script.runInContext(context);
    let expr;
    if (typeof m.exports.substring_search=='function')
        expr = 'module.exports.substring_search';
    else if (typeof m.exports=='function')
    {
        if (warnings)
        {
            console.warn('Warning: Function exposed as the top-level export'
                +' rather than a named export');
        }
        expr = 'module.exports';
    }
    else
    {
        let exported = Object.keys(m.exports);
        if (exported.length==1 && typeof m.exports[exported[0]]=='function')
        {
            if (warnings)
            {
                console.warn('Warning: Found export '+exported[0]
                    +' instead of substring_search');
            }
            expr = 'module.exports['+JSON.stringify(exported[0])+']';
        }
        else
            throw new Error('Function substring_search not found');
    }
    warnings = false;
    vm.runInContext(id+'.res = '+expr+'('+id+'.needles, '+id+'.haystack)',
        context, {timeout: 5000});
    let time2 = Date.now();
    let res = JSON.parse(vm.runInContext('JSON.stringify('+id+'.res)',
        context));
    assert.deepStrictEqual(res, expected);
}

function run_test(script, name, test){
    try {
        run_search(script, test.needles, test.haystack, test.expected);
    } catch(e){
        let text = `Test ${name} failed: `;
        if (e instanceof assert.AssertionError)
        {
            text += 'wrong result\n';
            text += 'Needles: '+util.inspect(test.needles)+'\n';
            text += 'Haystack: '+util.inspect(test.haystack)+'\n';
            text += 'Expected: '+util.inspect(test.expected)+'\n';
            text += 'Returned: '+util.inspect(e.actual);
        }
        else
            text += e.message;
        throw new Error(text);
    }
}

function main(target){
    console.log('Testing correctness:', target);
    try {
        let script = compile(target);
        for (let key in tests)
            run_test(script, key, tests[key]);
    } catch(e){
        console.log(e.message);
        process.exit(1);
    }
}

main(process.argv[2]);
