// Name: Optimized Regex matcher
// Author: Gustav W. Bertram
// Date: 10 Mar 2016

var exports = module.exports = {};

exports.substring_search = function(substrings, text) {
    var result = {}, prefixes = {}, regex, found;

    function escape(string) {
	return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    // Function to convert substrings to an optimized regex
    function toRegex(substrings)
    {
	function PatternTrie(patterns) {
	    this.trie = {};
	    this.prefixes = [];
	    
	    if (patterns) {
		this.addPatterns(patterns);
	    }
	}
	
	PatternTrie.prototype.addPatterns = function(patterns) {
	    for (var i=0, l=patterns.length; i<l; i++) {
		this.addPattern(patterns[i]);
	    }
	};
	
	PatternTrie.prototype.addPattern = function(pattern) {
	    var letter, current = this.trie, prefix = false;
	    
	    for (var i=0, l=pattern.length; i<l; i++) {
		letter = pattern[i];
		
		if (!current[letter]) {
		    current[letter] = {};
		}
		
		current = current[letter];
		
		if (current.isPattern) {
		    prefix = current.pattern;
		}
	    }
	    
	    // In case of duplicate patterns
	    if (!current.isPattern) {
		current.isPattern = true;
		current.pattern = pattern;
		
		if (prefix) {
		    this.prefixes[pattern] = prefix;
		}
	    }
	};

	function walk(depth, start, end)
	{
	    var i, c = "", regex = "", optional = false, count = 0;

	    // Advance past strings that are too short
	    while (start < end && substrings[start].length <= depth)
	    {
		// Remember that this is an optional group
		optional = true;
		start++;
	    }

	    // If we're at the end, return.
	    if (start == end)
	    {
		return "";
	    }

	    // If we only have one string
	    if (start == end-1) {

		// If that string is empty
		if (substrings[start].length == depth) {
		    return "";
		}

		// If it's a one character string, return a single optional character
		if (substrings[start].length == depth+1 && optional)
		{
		    return escape(substrings[start][depth]) + "?";
		}
		
		// Otherwise return the entire string
		regex += escape(substrings[start].slice(depth));
	    }
	    else
	    {
		// See which character we have to match for the next set
		c = substrings[start][depth];

		for (i = start; i < end; i++) {

		    // If we stop matching, then we need to make a subgroup
		    if (c != substrings[i][depth]) {
			count++;
			regex += escape(c) + walk(depth+1, start, i) + "|";

			c = substrings[i][depth];
			start = i;
		    }
		}
		
		// Add the last part
		if (i == end)
		{
		    count++;
		    regex += escape(c) + walk(depth+1, start, end);
		}
	    }
	    
	    // Set the grouping construct
	    if (optional || count > 1)
	    {
		regex = "(?:" + regex + (optional ? ")?" : ")");
	    }
	    
	    return regex;
	}

	// Substrings need to be sorted, or PatternTrie doesn't work.
	substrings.sort();

	var trie = new PatternTrie(substrings);
	prefixes = trie.prefixes;
	
	return walk(0,0,substrings.length);
    }
    
    // Initialize result function in the order it was received
    substrings.forEach( function(value) {
	result[value] = 0;
    });

    // Make the regex
    regex = new RegExp(toRegex(substrings),'g');

    console.log(toRegex(substrings));

    while (found = regex.exec(text)) {
	p = found[0];

	// Increment match and all prefixes
	do { 
	    result[p]++;
	}
	while (p = prefixes[p])

        regex.lastIndex = found.index+1;
    }

    return result;	 
}




