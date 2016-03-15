/**
 * Created by akoekemo on 2/10/16.
 */
/**
 * Search the text for the substrings and count how many times each substring occurs in the text
 * @param substrings array of substrings to search
 * @param text the text to scan
 *
 * @returns a map containing the results of the scan for each of the substrings
 */
exports.substring_search = function (substrings, text) {

    return search(new SearchContext(substrings), text);
};

/**
 * @private
 *
 * A Node object, acting as a state object in the search tree
 *
 * @constructor
 */
function Node() {
    // The substring being matched (if this node represents a termination node)
    this.substring;
    // The next characters to match
    this.next = [];
}

/**
 * The search context, containing an array of search nodes
 * @param substrings
 * @constructor
 */
function SearchContext(substrings) {
    this.substrings = substrings;
    this.rootNodes = new Array(0x7f - 0x20);

    var stringsLength = substrings.length;
    for (var is = 0; is < stringsLength; is++) {
        var substring = substrings[is];
        var nodeList = this.rootNodes;
        var stringLength = substring.length;
        for (var c = 0; c < stringLength; c++) {
            var index = substring.charCodeAt(c) - 0x20;
            var node = nodeList[index];
            if (node == undefined) {
                node = new Node();
                nodeList[index] = node;
            }
            if (c == stringLength - 1) {
                node.substring = substring;
                break;
            }
            nodeList = node.next;
        }
    }
}

/**
 * Use the serch context to locate and count substrings
 * @param context the search context
 * @param text the text to scan
 * @returns {} with the results of the scan
 */
function search(context, text) {
    var result = {};
    context.substrings.forEach(function (s) {
        result[s] = 0;
    });

    var textLength = text.length;

    for (var index = 0; index < textLength; index++) {
        var node = context.rootNodes[text.charCodeAt(index) - 0x20];
        var idx = index;
        while (node != undefined) {
            if (node.substring != undefined) {
                result[node.substring]++;
            }
            if (++idx >= textLength) {
                break;
            }
            node = node.next[text.charCodeAt(idx) - 0x20];
        }
    }
    return result;
}
