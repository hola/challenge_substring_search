/*
 * Hola JS Africa Challenge: substring search
 * Entry by Mike Yudaken, Johannesburg, South Africa
 * myudaken@gmail.com
 * 
 * Copyright (c) 2016 Mike Yudaken
 * All rights reserved.
 *
 * This software may be modified and distributed 
 * under the terms of the BSD license.
 * 
 */

'use strict';

// search string text for each string in array substrings[]
// and return the number of matches for each
exports.substring_search = function(substrings, text){
	let result = {};
	let todo = [];

	for (let k in substrings){
		let string = substrings[k];
		result[string] = 0;
		todo.push(string);
	}

	for (;;){
		// find a set of strings in todo[] that do not have a common prefix
		// move each one from todo[] to these[]
		let these = [];
		for (let k in todo){
			let string = todo[k];
			let no_matching_prefix = true;
			for (let j in these){
				// check for a matching prefix
				if (      (these[j].indexOf(string) == 0)
					   || (string.indexOf(these[j]) == 0)){
					no_matching_prefix = false;
					break;
				}
			}
			if (no_matching_prefix){
				these.push(string);
				delete todo[k];
			}
		}

		// finished ?
		if (these.length == 0)
			break;

		// replace each regexp special character 'X' with '\X'
		let escaped = these.map(function escape_regexp(s){
			return(s.replace(/([\.\\\[\]\|\^\$\(\)\*\+\?\{\}])/g, '\\$1'))
		});

		// build a regexp to search for any of the strings in escaped[]
		let regexp = new RegExp(escaped.join('|'), 'g');

		// find the number of matches for each of these[]
		let match;
		while ((match = regexp.exec(text)) != null){
			result[match[0]]++;
			regexp.lastIndex -= match[0].length - 1; // backtrack
		}
	}

	return(result);
}
