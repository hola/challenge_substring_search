/**
 * Created by Charles Okot (ceokot@gmail.com) on 2/28/2016.
 */

exports.substring_search = function(subStrings, text) {
    var res = {};
    subStrings.forEach(s => res[s] = text.split(s).length - 1);
    return res;
};
