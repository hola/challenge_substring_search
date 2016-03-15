/**
 * Created by lawrencenyakiso on 2016/02/08.
 * Copyright © 2016 Lawrence Nyakiso
 * lawrencenyakiso@gmail.com
 * Location: Johannesburg, South Africa, GMT+2
 */
'use strict'
exports.substring_search = function (strings, text) {
    var sa = strings.reverse(), sal = sa.length, sr = /[^\u0020-\u007F]/g, res = {}, cs, tl = text.length;
    if (sal < 100) {
        for (var x = sal - 1; x >= 0; x--) {
            cs = sa[x];
            var ns = text, nsl = tl, csl = sa[x].length, ssr = '(?:\\' + cs + ')', k, m = sa[x].search(sr);
            if (csl < 100 && m == -1 && csl !== 0) {
                res[sa[x]] = 0;
                while (nsl >= csl) {
                    var is = ns.search(ssr, 'g');
                    if (is !== -1) {
                        res[sa[x]]++,k = is + csl, ns = ns.slice(k), nsl = ns.length;
                    } else {
                        if (!res[sa[x]]) {
                            res[sa[x]] = 0;
                        }
                        nsl = -1;
                    }
                }
            } else {
                return undefined
            }
        }
        return res;
    } else {
        return undefined;
    }

};
