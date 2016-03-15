exports.substring_search = function(substrings, text){
    var res = {}
    aho_corasick(substrings, text).forEach((count, i) => {
        res[substrings[i]] = count;
    });
    return res;
};

aho_corasick = function(substrings, text){
    var trie = new Trie();
    substrings.forEach(s => {
        trie.addString(s)
    });
    trie.buildAutomaton();
    return trie.matches(text);
};

var TrieNode = function() {
    this.matches = new LinkedList();
    this.children = new Map();
    this.suffix = null;
};

var Trie = function(){
    this.root = new TrieNode();
    this.size = 0;
};

Trie.prototype = {
    addString: function(string) {
        var node = this.root;
        for (var c of string) {
            if (node.children.has(c)) {
                node = node.children.get(c);
            } else {
                var child = new TrieNode();
                node.children.set(c, child);
                node = child;
            }
        }
        node.matches.add(this.size++);
    },
    buildAutomaton: function() {
        var queue = new Queue(this.size);
        for (var child of this.root.children.values()) {
            queue.enqueue(child);
            child.suffix = this.root;
        }
        while (!queue.empty()) {
            var node = queue.dequeue();
            node.children.forEach((child, c) => {
                queue.enqueue(child);
                var suffix = node.suffix;
                while(!suffix.children.has(c) && suffix.suffix != null) {
                    suffix = suffix.suffix;
                }
                child.suffix = suffix.children.get(c) || this.root; 
                child.matches.append(child.suffix.matches);
            });
        }
    },
    matches: function(string) {
        var matches = new Array(this.size).fill(0);
        var node = this.root;
        for (var c of string) {
            while (!node.children.has(c) && node.suffix != null) {
                node = node.suffix;
            }
            node = node.children.get(c) || this.root;
            node.matches.forEach(i => {
                matches[i]++;
            });
        }
        return matches;
    }
}

var Queue = function(capacity) {
    this.data = new Array(capacity + 1);
    this.start = 0;
    this.end = 0;
}

Queue.prototype = {
    constructor: Queue,
    empty: function() {
        return this.start == this.end;
    },
    enqueue: function(item) {
        this.data[this.end] = item;
        this.end = (this.end + 1) % this.data.length;
    },
    dequeue: function() {
        var item = this.data[this.start];
        this.start = (this.start + 1) % this.data.length;
        return item;
    }
};

var LinkedListNode = function(item) {
    this.item = item;
    this.next = null;
}

var LinkedList = function() {
    this.first = null;
    this.last = null;
}

LinkedList.prototype = {
    constructor: LinkedList,
    empty: function() {
        return this.first == null;
    },
    add: function(item) {
        if (this.empty()) {
            this.first = this.last = new LinkedListNode(item);
        } else {
            this.last.next = new LinkedListNode(item);
            this.last = this.last.next;
        }
    },
    append: function(list) {
        if (list.empty()) {
            return;
        } else if (this.empty()) {
            this.first = list.first;
            this.last = list.last;
        } else {
            this.last.next = list.first;
            this.last = list.last;
        }
    },
    forEach: function(f) {
        for (var node = this.first; node != null; node = node.next) {
            f(node.item);
        }
    }
}
