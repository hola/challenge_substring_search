'use strict';

var ACTrie = (function() {
    
    var ctor = function() {
        this.root = createNode(null, null);
        this.result = {};
    };
    
    var createNode = function (char, parent) {
        return {
            char: char,
            parent: parent,
            match: null,
            children: {},
        };
    }
    
    var addString = function(s) {
        this.result[s] = 0;
        var position = 0;
        var currentNode = this.root
        var len = s.length;
        while(position < len) {
            var currentChar = s.charAt(position);
            var childNode = currentNode.children[currentChar];
            if(childNode == undefined) {
                childNode = currentNode.children[currentChar] = createNode(currentChar, currentNode);
            }
            currentNode = childNode;
            position = position + 1;
        }
        currentNode.match = s;
    };
    
    var makeFailTransitions = function () {
        var queue = [];
        this.root.fail = this.root;
        queue.push(this.root);
        while (queue.length != 0) {
            var currentNode = queue.shift();
            for (var currentChildKey in currentNode.children) {
                if (currentNode.children.hasOwnProperty(currentChildKey)) {
                    queue.push(currentNode.children[currentChildKey])
                }
            }
            if (currentNode == this.root) continue;
            var currentFail = currentNode.parent.fail;
            while (currentFail.children[currentNode.char] == undefined && currentFail != this.root) currentFail = currentFail.fail;
            currentNode.fail = currentFail.children[currentNode.char];
            if (currentNode.fail == undefined || currentNode.fail == currentNode) currentNode.fail = this.root;
        }
    };
    
    var acSearch = function (s) {
        var currentNode = this.root;
        var len = s.length;
        for (var i = 0; i < len; i++) {
            var currentChar = s.charAt(i);
            var searchNode = currentNode;
            while (searchNode.children[currentChar] == undefined && searchNode != this.root) searchNode = searchNode.fail;
            if (searchNode == this.root) {
                searchNode = searchNode.children[currentChar];
                if (searchNode == undefined) searchNode = this.root;
            }
            else {
                searchNode = searchNode.children[currentChar];
            }
            var failNode = searchNode;
            while (failNode != this.root) {
                if (failNode.match != null) {

                    this.result[failNode.match] = this.result[failNode.match] + 1;
                }
                failNode = failNode.fail;
            }
            currentNode = searchNode;
        }
        return this.result;
    };
    
    ctor.prototype.addString = addString;
    ctor.prototype.makeFailTransitions = makeFailTransitions;
    ctor.prototype.acSearch = acSearch;
    
    return ctor;
})();

function substring_search(substrings, text) {
    var trie = new ACTrie();
    substrings.forEach(s => trie.addString(s));
    trie.makeFailTransitions();
    return trie.acSearch(text);
};

module.exports = {
    substring_search: substring_search
};