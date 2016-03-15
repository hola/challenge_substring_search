/*  Hola JS Africa Challenge: substring search
    By KenR
    kenramela@gmail.com


    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.


The Trie() and AhoCorasick() classes were written by Thomas Booth and 
Dejian Xu in CoffeeScript, translated to JavaScript by CoffeeScript 1.4.0
and modified here for the Hola JS Africa Challenge. Modifications
include:
  - use buffer instead of string (2 to 8 times speed increase)
  - added count function to just count matches
  - removed unused functions

# References
https://en.wikipedia.org/wiki/Aho-Corasick
https://travis-ci.org/hsujian/aho-corasick
https://github.com/tombooth/aho-corasick.js

Original aho-corasick license:
-----------------------------
Copyright (C) 2012 Thomas Booth
Copyright (C) 2012 Dejian Xu

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
-----------------------------

 */


'use strict';

var Trie = (function() {
	
    function Trie() {
		this.next = {};
		this.is_word = null;
		this.value = null;
    }
	
    Trie.prototype.add = function(word, original_word) {
		var chr, node;
		chr = word[0];
		node = this.next[chr];
		if (!node) {
			node = this.next[chr] = new Trie();
			if (original_word)
				node.value = original_word.slice(0, original_word.length - word.length + 1);
			else
				node.value = word.slice(0, 1);
		}
		if (word.length > 1)
			return node.add(word.slice(1), original_word || word);
		else
			return node.is_word = true;
    };
	
    Trie.prototype.explore_fail_link = function(word) {
		var chr, i, node, _i, _ref;
		node = this;
		for (i = _i = 0, _ref = word.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
			chr = word[i];
			node = node.next[chr];
			if (!node)
				return null;
		}
		return node;
    };
	
    return Trie;
	
})();

var AhoCorasick = (function() {
	
    function AhoCorasick() {
		this.trie = new Trie();
    }
	
    AhoCorasick.prototype.add = function(word) {
		return this.trie.add(word);
    };
	
    AhoCorasick.prototype.build_fail = function(node) {
		var fail_node, i, sub_node, _i, _k, _ref, _ref1;
		node = node || this.trie;
		node.fail = null;
		if (node.value) {
			for (i = _i = 1, _ref = node.value.length; 1 <= _ref ? _i < _ref : _i > _ref; i = 1 <= _ref ? ++_i : --_i) {
				fail_node = this.trie.explore_fail_link(node.value.slice(i));
				if (fail_node) {
					node.fail = fail_node;
					break;
				}
			}
		}
		_ref1 = node.next;
		for (_k in _ref1) {
			sub_node = _ref1[_k];
			this.build_fail(sub_node);
		}
		return this;
    };
	
	AhoCorasick.prototype.count = function(string, result) {
		var chr, current, idx, _i, _ref, node;
		current = this.trie;
		for (idx = _i = 0, _ref = string.length; 0 <= _ref ? _i < _ref : _i > _ref; idx = 0 <= _ref ? ++_i : --_i) {
			chr = string[idx];
			while (current && !current.next[chr])
				current = current.fail;
			if (!current)
				current = this.trie;
			if (current.next[chr]) {
				current = current.next[chr];
				for (node = current; node; node = node.fail)
					if (node.is_word)
						result[node.value]++;
			}
		}
		return this;
    };

    return AhoCorasick;
	
})();

exports.substring_search = function(substrings, text){
	var ac = new AhoCorasick();
	var result = {};

	text = new Buffer(text, 'ascii');
	
	for (let k in substrings){
		result[substrings[k]] = 0;
		ac.add(new Buffer(substrings[k], 'ascii'));
	}
	
	ac.build_fail();
	
	ac.count(text, result);
	return(result);
}
