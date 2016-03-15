// Hola JS Africa Challenge - Substring Search
// --
// Entry by Daniel '64Mega' Lawrence
//
// An implementation of the Aho-Corasick algorithm
// Uses Tries and a slightly simplified version of a Finite State Machine
// to rapidly search for the terms provided.
//
// It differs from other algorithms, such as Boyer-Moore, in that it does
// better with a big collection of search terms as it searches for all
// terms simultaneously instead of one at a time.
// 
// -- 
// Reading and Resources used: 
// https://en.wikipedia.org/wiki/Aho-Corasick_algorithm
// https://cr.yp.to/bib/1975/aho.pdf - Efficient String Matching: An Aid to Bibliographic Search (Original paper by Afred Aho and Margaret Corasick
// 
// -- CHANGES:
// @ 1/03/2016: Fix typo in TNode class definition (this.end -> this.isEnd)

// Trie Node class
// -- 
var TNode = function(aChar) {
    this.children = [];
    this.char = aChar;
    this.next = null;
    this.isEnd = false;
    this.parent = null;
    this.fall = null; 
    this.fullword = "";
};

// Searches for a child node. 
// -- 
// Arg1: char to look for
TNode.prototype.getChild = function(aChar) {
    var node = this.children[aChar.charCodeAt(0) % 4];
    if(node === undefined || node === null) { return null; }
    
    while(node.next !== null) {
	if(node.char == aChar) { return node; }
	node = node.next;
    }
    
    if(node.char === aChar) { return node; }
    return null;
};

// Adds a Word to the Trie
// Children are stored in such a way that the space taken up in the trie is 
// minimized to only the children actually stored, rather than the usual method
// of having a potential pointer to each potential member of an alphabet.
// This trie achieves this via a simple linked list of arrays. In the best case
// (Fewer than four children), access time is vastly improved. Worst case
// grows depending on the links in the node, but those links are essentially
// capped at the size of the provided alphabet, making the worst-case for a 
// search no worse than a standard Trie based Aho-Corasick implementation.
// --
// Arg1: aString - Word to add
// Arg2: fullString - Used internally for recursion, ignore it.
TNode.prototype.addWord = function(aString, fullString) {
    if(!fullString) { fullString = aString; }
    var node = this.getChild(aString[0]);
    
    if(node === null) { // No existing child
	node = new TNode(aString[0]);
	node.parent = this;
	var pos = aString.charCodeAt(0) % 4;
	if(this.children[pos] === undefined) { 	    
	    this.children[pos] = node; 
	} else {
	    var no = this.children[pos];
	    while(no.next !== null) { no = no.next; }
	    no.next = node;
	}
    }

    if(aString.length > 1) { node.addWord(aString.substring(1, aString.length), fullString); }
    else { node.isEnd = true; node.fullword = fullString; }
};

// Checks if the trie contains a word, using a simple recursive approach.
// --
// Arg1: Word to search for
TNode.prototype.contains = function(aString) {
    if(aString.length === 0) { return this.isEnd; }
	
    var node = this.getChild(aString[0]);

    if(node === null) { return false; }
    else { return node.contains(aString.substring(1, aString.length)); }
};

// Constructs fall 'pointers'. These are used to quickly transition to the next
// possible pattern match in the case of a failure.
// --
// Arg1: Root of Trie
TNode.prototype.constructFalls = function(root) {
    root.fall = root;
    var q = [];

    q.push(root);
    
    while(q.length !== 0) {
	var node = q.shift();
	var no = null;
	
	for(var i = 0; i < 4; i++) {
	    no = node.children[i];
	    if(no === null || no === undefined) { continue; }
	    while(no.next !== null && no.next !== undefined) { q.push(no); no = no.next; }
	    q.push(no);
	}
	
	if(node === root) { continue; }
	
	var fall = node.parent.fall;
	while(fall.getChild(node.char) === null && fall !== root) { fall = fall.fall; }
	node.fall = fall.getChild(node.char);
	if(node.fall === null) { node.fall = root; }
	if(node.fall === node) { node.fall = root; }
    }
};

// Exported function to perform the search, returns object with number-of-occurrences
// as per spec.
exports.substring_search = function(substrings, text) {
    var root = new TNode(null); // Construct root node
    var results = {};

    // Initialize and add search terms to Trie
    substrings.forEach(s => {
	root.addWord(s);
	results[s] = 0;
    });

    // Construct fall jumps
    root.constructFalls(root);

    // Search begins here
    var curstate = root;
    var n1 = null;
    var n2 = null;
    
    // Single loop over entire text
    for(var i = 0; i < text.length; i++) {
	n1 = curstate;
	var c = text[i];
	
	while(n1.getChild(c) === null && n1 != root) { n1 = n1.fall; }
	if(n1 === root) {
	    n1 = n1.getChild(c);
	    if(n1 === null) { n1 = root; }
	} else {
	    n1 = n1.getChild(c);
	}

	n2 = n1;
	while(n2 !== root) {
	    if(n2.isEnd) {
		results[n2.fullword] += 1;
	    }
	    n2 = n2.fall;
	}
	curstate = n1;
    }

    return results;
};
