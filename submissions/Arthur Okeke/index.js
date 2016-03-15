/**
 * Okeke Arthur Ugochukwu
 * arthurugochukwu@gmail.com
 * 
 * @param {type} substrings
 * @param {type} text
 * @returns {object}
 */
var brute_search = function(substrings, text){
    var result = {};
    substrings.forEach(function(s){
        result[s] = 0;
        for (var i=0; i<text.length; i++)
        {
            if (text.slice(i, i+s.length)==s)
                result[s]++;
        }
    });
    return result;
};
var trie;
(function() {

  var Boyer, KMP;

  KMP = (function() {

    function KMP() {
      this.branch = {};
      this.is_word = null;
      this.value = null;
      this.data = [];
    }

    KMP.prototype.add = function(word, data, original_word) {
      var chr, pair;
      chr = word.charAt(0);
      pair = this.branch[chr];
      if (!pair) {
        pair = this.branch[chr] = new KMP();
        if (original_word) {
          pair.value = original_word.substr(0, original_word.length - word.length + 1);
        } else {
          pair.value = chr;
        }
      }
      if (word.length > 1) {
        return pair.add(word.substring(1), data, original_word || word);
      } else {
        pair.data.push(data);
        return pair.is_word = true;
      }
    };

    KMP.prototype.explore_fail_link = function(word) {
      var chr, i, pair, _i, pointer;
      pair = this;
      for (i = _i = 0, pointer = word.length; 0 <= pointer ? _i < pointer : _i > pointer; i = 0 <= pointer ? ++_i : --_i) {
        chr = word.charAt(i);
        pair = pair.branch[chr];
        if (!pair) {
          return null;
        }
      }
      return pair;
    };

    KMP.prototype.each_pair = function(callback) {
      var pair, _k, pointer, pointer1;
      pointer = this.branch;
      for (_k in pointer) {
        pair = pointer[_k];
        callback(this, pair);
      }
      pointer1 = this.branch;
      for (_k in pointer1) {
        pair = pointer1[_k];
        pair.each_pair(callback);
      }
      return this;
    };

    return KMP;

  })();

  Boyer = (function() {

    function Boyer() {
      this.trie = new KMP();
    }

    Boyer.prototype.add = function(word, data) {
      return this.trie.add(word, data);
    };

    Boyer.prototype.build_fail = function(pair) {
      var fail_pair, i, sub_pair, _i, _k, pointer, pointer1;
      pair = pair || this.trie;
      pair.fail = null;
      if (pair.value) {
        for (i = _i = 1, pointer = pair.value.length; 1 <= pointer ? _i < pointer : _i > pointer; i = 1 <= pointer ? ++_i : --_i) {
          fail_pair = this.trie.explore_fail_link(pair.value.substring(i));
          if (fail_pair) {
            pair.fail = fail_pair;
            break;
          }
        }
      }
      pointer1 = pair.branch;
      for (_k in pointer1) {
        sub_pair = pointer1[_k];
        this.build_fail(sub_pair);
      }
      return this;
    };

    Boyer.prototype.foreach_match = function(pair, pos, callback) {
      var offset;
      while (pair) {
        if (pair.is_word) {
          offset = pos - pair.value.length;
          callback(pair.value, pair.data, offset);
        }
        pair = pair.fail;
      }
      return this;
    };

    Boyer.prototype.search = function(string, callback) {
      var chr, current, idx, _i, pointer;
      current = this.trie;
      for (idx = _i = 0, pointer = string.length; 0 <= pointer ? _i < pointer : _i > pointer; idx = 0 <= pointer ? ++_i : --_i) {
        chr = string.charAt(idx);
        while (current && !current.branch[chr]) {
          current = current.fail;
        }
        if (!current) {
          current = this.trie;
        }
        if (current.branch[chr]) {
          current = current.branch[chr];
          if (callback) {
            this.foreach_match(current, idx + 1, callback);
          }
        }
      }
      return this;
    };


    return Boyer;

  })();

trie = new Boyer();

}).call(this);


//var trie = new Boyer();
var fast_search = function(substrings, text){
    var buffer = {};
    substrings.forEach(function(word){
        trie.add(word);
        buffer[word] = 0;
    });
    trie.build_fail();
    trie.search(text, function(word){
       buffer[word]++;
    });
    return buffer;
};


function fallback(str) {
    var table = new Array(str.length);
    var L = 0;
    table[0] = 0;
     for (var i = 1; i < str.length; i++) {
        while (L > 0 && str.charAt(i) !== str.charAt(L)) {
            L = table[L - 1];
        }
        if (str.charAt(L) === str.charAt(i)) {
            L++;
        }
    table[i] = L;
        }
    return table;
}              
function kmpMatcher(pattern, str) {
    var prefixes = fallback(pattern);
    var counter = 0;
    var j = 0;
    var i = 0;
    while (i < str.length) {
        if (str.charAt(i) === pattern.charAt(j)) {
            i++;
            j++;
        }
        if (j === pattern.length) {
            counter++;
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
    return counter;
}

    function ropeMatch(substrings, text){
    var res = {};
    for(var i = 0; i < substrings.length; i++)res[substrings[i]] = 0;
    for (var i = 0; i < substrings.length; i++) {
        var counter = kmpMatcher(substrings[i], text);
        res[substrings[i]] = res[substrings[i]] + counter;
    }
    return res;
    }

 
exports.substring_search = function(substrings, text){
    
    var n = text.length;
    var m = substrings.length;
    var obj;
    if(n <= 90 && m <= 4){
        
        obj = brute_search(substrings, text);
    }
    else if(m >= 60 && n >= 5000){
        
        obj = fast_search(substrings, text);
    }else{
       
        obj = ropeMatch(substrings, text);
    }
    
    return obj;
};