	/**
	 *
	 *  Copyright (c) 2016 Kenneth nnani.
	 *  All rights reserved.
	 *  @module hola-js-programming-challenge
	*/
	'use strict';

	function create2DMmatrix(rows, cols, defaultValue){
		var arr = [];
			for(var i = 0; i < rows; i++){ 
				arr.push([]);
				arr[i].push(new Array(cols));
				for(var j = 0; j < cols; j++){ 
				arr[i][j] = defaultValue;
				}
			 }
		 return arr;
	}

	function create1DMmatrix(size, defaultValue){
		var arr = [];
			for(var i = 0; i < size; i++){ 
				   arr[i] = defaultValue;
			 }
		return arr;
	}

	function Queue(){
	    var queue  = [];
	    var offset = 0;
	    this.getSize = function(){
	       return (queue.length - offset);
	    }
	    this.enqueue = function(item){
	        queue.push(item);
	    }
	    this.dequeue = function(){
	        if (queue.length == 0) return undefined;
	        var item = queue[offset];
	        if (++offset * 2 >= queue.length){
	            queue  = queue.slice(offset);
	            offset = 0;
	        }
	        return item;
	    }
	    this.peek = function(){
	        return (queue.length > 0 ? queue[offset] : undefined);
	    }
	}

	var MAXS = 10000; // Max number of states in the matching machine.
	var MAXC = 96; // Number of characters in the alphabet set.
	var spaceChar = String.fromCharCode(32);
	var deleteChar = String.fromCharCode(127);
	var out;
	var f;
	var g;

	function buildMatchingAutomata(words, lowestChar, highestChar){
		out = create1DMmatrix(MAXS, 0);
		f = create1DMmatrix(MAXS, -1);
		g = create2DMmatrix(MAXS, MAXC, -1); 

	    var states = 1; 
	        
	    for (var i = 0; i < words.length; ++i) {
	        var keyword = words[i]; 
	        var currentState = 0;
	        for (var j = 0; j < keyword.length; ++j) {
	            var c = keyword.charCodeAt(j) - 32;
	            if (g[currentState][c] == -1) { 
	                g[currentState][c] = states++;
	            }
	            currentState = g[currentState][c]; 
	        }
	        out[currentState] = ( out[currentState] | (1 << i) ); 
	    }

	    for (var c = 0; c < MAXC; c++) {
		       if ( g[0][c] == -1 ) {
		            g[0][c] = 0;
		    }
		}
		
	    var q = new Queue();
	    for (var c = 0; c <= 95; c++) {
	        if (g[0][c] != -1 && g[0][c] != 0) {
	            f[g[0][c]] = 0;
	            q.enqueue(g[0][c]);
	        }
	    }
	  
	    while (q.getSize() > 0) {
	        var state = q.peek();
	        q.dequeue();
	        for (var c = 0; c <= 95; c++) {
	            if(g[state][c] != -1) {
	                var failure = f[state];
	                while(g[failure][c] == -1) {
	                    failure = f[failure];
	                }
	                failure = g[failure][c];
	                f[g[state][c]] = failure;
	                out[g[state][c]] = ( out[g[state][c]] | out[failure] );
	                q.enqueue(g[state][c]); 
	            }
	        }
	    }
	    return states;
	}

	function goToNextState(currentState, nextInput, lowestChar ) {
	    var answer = currentState;
	    var c = nextInput.charCodeAt() - 32;
	    while (g[answer][c] == -1) answer = f[answer];
	    return g[answer][c];
	}

	function failure(str) {
	    var table = new Array(str.length);
	    var maxPrefix = 0;
	    table[0] = 0;
	    for (var i = 1; i < str.length; i++) {
	        while (maxPrefix > 0 && str.charAt(i) !== str.charAt(maxPrefix)) {
	          maxPrefix = table[maxPrefix - 1];
	        }
	        if (str.charAt(maxPrefix) === str.charAt(i)) {
	          maxPrefix++;
	        }
	        table[i] = maxPrefix;
	    }
	    return table;
	}

	function kmpMatcher(pattern, str) {
	    var prefixes = failure(pattern);
	    var cnt = 0;
	    var j = 0;
	    var i = 0;
	    while (i < str.length) {
	        if (str.charAt(i) === pattern.charAt(j)) {
	          i++;
	          j++;
	       }
	       if (j === pattern.length) {
	            cnt++;
	            j = prefixes[j-1];
	       }
	       else if (str.charAt(i) !== pattern.charAt(j)) {
	            if (j !== 0) {
	                j = prefixes[j-1];
	            } else {
	                i++;
	            }
	        }
	    }
	    return cnt;
	}

	function linearAutomataMatcher(substrings, text){
	    var res = {};
	    for(var i = 0; i < substrings.length; i++)res[substrings[i]] = 0;
	    for (var i = 0; i < substrings.length; i++) {
	         var cnt = kmpMatcher(substrings[i], text);
	         res[substrings[i]] = res[substrings[i]] + cnt;
	    }
	    return res;
	}

	function MultivariateAutomatamatcher(substrings, text){
		var res = {};
		for(var i = 0; i < substrings.length; i++)res[substrings[i]] = 0; //init
	    buildMatchingAutomata(substrings, spaceChar, deleteChar);
	    var currentState = 0;
	    for (var i = 0; i < text.length; i++) {
	         currentState = goToNextState(currentState, text[i], spaceChar);
	         if (out[currentState] == 0) continue;
	       	 for (var j = 0; j < substrings.length; j++) {
	           	if (out[currentState] & (1 << j)) {
	           	    res[substrings[j]]++;
	            }
	         }
	   }
	   return res;
	}

	var substring_search = function(substrings, text){
	     if(substrings.length < 5)  
	     	return linearAutomataMatcher(substrings, text);
	     else
	       return MultivariateAutomatamatcher(substrings, text); 
	}; 
	exports.substring_search = substring_search;
