/*
 * The following method makes use of the Knuth-Morris-Pratt string searching algorithm
 * to find all the occurences of a given string within a text. The algorithm is slightly
 * modified to accommodate searching for multiple occurences.
 *
 * */
exports.substring_search = function(needles, haystack){
    var lps = []; var locations = [];
    var i; var j;
    var len;
    var L; var M; var N = haystack.length;
    var z; var a = 0; var y = 0; var x = 0;
    var results = {};

    for(a = 0; a < needles.length; a++){
        /* Simple checks to improve performance for interesting cases */
        if(needles[a].length > haystack.length) {
            results[needles[a]] = 0;
        }else if(haystack.length == 0){
            for(a = 0; a < needles.length; a++){
                results[needles[a]] = 0;
            }
            return results;
        }else if(needles[a].length == 0){
            results[needles[a]] = 0;
        } else{

             /* Adding (needles[a].length) values to the array  */
            for(y = 0; y < needles[a].length; y++ ){
                lps.push(0);
            }

            /* Calculate longest proper prefix array */
            i = 1; len = 0; L = needles[a].length;
            while(i < L){
                if(needles[a].charAt(i) == needles[a].charAt(len)){
                    len = len + 1;
                    lps[i] = len;
                    i = i + 1;
                }else{
                    if(len != 0){
                        len = lps[len - 1];
                    }else{
                        lps[i] = 0;
                        i++;
                    }
                }
            }

            /* Adding (haystack.length +1) values to the array  */
            i = 0; j = 0; M = needles[a].length; z = 1;
                for(x = 0; x < (N+1); x++){
                locations.push(0);
            }

            /* Search for the needle in the haystack  */
            while(i < N){
                if(needles[a].charAt(j) == haystack.charAt(i)){
                    i = i + 1;
                    j = j + 1;
                }

                if(j == M){
                    locations[z++] = (i - j);
                    locations[0]++;
                    j = lps[j - 1];
                }else if( (i < N) && (needles[a].charAt(j) != haystack.charAt(i)) ){
                    if(j != 0){
                        j = lps[j-1];
                    }else{
                        i = i + 1;
                    }
                }
            }

            results[needles[a]] = locations[0];
            y = 0;
            x = 0;
            lps = [];
            locations = [];
        }
    }
    return results;
}


