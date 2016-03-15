/**
 * substring search challenge
 * https://github.com/hola/challenge_substring_search
 *author: bbundi
 *otosolutions.co.ke
 * Copyright (c) 2016 bb
 * Licensed under the MIT license.
 */


exports.substring_search = function(substrings, text){ //regex
       // var res = {};
		
		//if(text.length>)
        //switch different algos
        
        
        return indexof(substrings, text);
    };
	
 regex = function(substrings, text){ //regex
            var res = {};
            substrings.forEach(s=>{
                res[s] = 0;
                        var matches=text.match(new RegExp(s, "g"));
                        res[s] = matches?matches.length:0;
                        
            });
           
            return res;
        };
    
    
    indexof = function(substrings, text){
        var res = {};
		//text += "";
        substrings.forEach(s=>{
            res[s] = 0;
                var pos = 0;  
                var step = s.length;
            for (var pos; pos<text.length; pos)
            {
                                pos = text.indexOf(s, pos);
                                if (~pos) {
                                        res[s]++;
                                pos += step;  
                        } else break;               
                }
        });
        
        
        return res;
    };
    slice = function(substrings, text){
        var res = {};
        substrings.forEach(s=>{
            res[s] = 0;
            for (var i=0; i<text.length; i++)
            {
                if (text.slice(i, i+s.length)==s)
                    res[s]++;
            }
        });
        return res;
    };
	bmh = function(substrings, text){ //boyer_moore_horspool : 16-32
        var res = {};
		//text += "";
        substrings.forEach(s=>{
            res[s] = 0;
                var pos = 0;  
                var step = s.length;
            for (var pos; pos<text.length; pos)
            {
                                pos = bmhOne(s,text, pos);
                                if (~pos) {
                                        res[s]++;
                                pos += step;  
                        } else break;               
                }
        });
        
        
        return res;
    };
     
    function bmhOne(needle,haystack,start) { 
				if(needle.length <1)return -1;
	
	
                var badMatchTable = {},
                maxOffset = (haystack.length - needle.length),
                last = (needle.length - 1),
                offset = start||0,
                scan ;
        
            // Generate the "bad match table", which is the location of offsets
            // to jump forward when a comparison fails
            Array.prototype.forEach.call(needle, function (char, i) {
                badMatchTable[char] = (last - i);
            });
            // Now look for the needle
            while (offset <= maxOffset) {
                // Search right-to-left, checking to see if the current offset at
                // needle and haystack match.  If they do, rewind 1, repeat, and if we
                // eventually match the first character, return the offset.
                for (scan=last; needle[scan] === haystack[scan+offset]; scan--) {
                    if (scan <0) {
                        return offset; break;
                    }
                }
                offset += (badMatchTable[haystack[offset + last]] || (last==0?1:last));
				
            }
			return -1;
        };   







		
    var theString = `
    `
 /*    jQuery.ajax({
            url: 'http://textfiles.com/science/larson.ph',
            success: function (result) {
              theString = result.slice(0,result/50) ;
            },
            async: false
        });
		*/
	var http = require('http');
/*	http.get({ host: 'textfiles.com',path: '/science/nukecat.txt'}).on('response', function (response) {
    
    var i = 0;
    response.on('data', function (chunk) {
        i++;
        theString += chunk;
        console.log('BODY Part: ' + i);
    });
    response.on('end', function () {

        //console.log(theString);
        console.log('Finished');
		
		tests();
});
});	
*/

function epicRandomString(){function f(a){for(var c=(Math.random()*eval("1e"+~~(50*Math.random()+50))).toString(36).split(""),b=3;b<c.length;b++)b==~~(Math.random()*b)+1&&c[b].match(/[\x20-\x7f]/)&&(c[b]=c[b].toUpperCase());c=c.join("");c=c.substr(~~(Math.random()*~~(c.length/3)),~~(Math.random()*(c.length-~~(c.length/3*2)+1))+~~(c.length/3*2));if(24>a)return a?c.substr(c,a):c;c=c.substr(c,a);if(c.length==a)return c;for(;c.length<a;)c+=f();return c.substr(0,a)}var d=arguments,a,e;if(!d.length)return f();for(var b=0;b<d.length;b++)"string"==typeof d[b]&&d[b].length&&!a&&(a=d[b]),"number"==typeof d[b]&&d[b]&&!e&&(e=d[b]);if(!a&&!e)return f();if(!a)return f(e);if(!e){a=btoa(escape(encodeURIComponent(a))).replace(/[^\w]/g,"");a=a.split("");for(b=a.length-1;0<b;b--){var d=Math.floor(Math.random()*(b+1)),g=a[b];a[b]=a[d];a[d]=g}return a.join("")}a=btoa(escape(encodeURIComponent(a))).replace(/[^\w]/g,"");b=f(e-a.length);a=(a+b).split("");for(b=a.length-1;0<b;b--)d=Math.floor(Math.random()*(b+1)),g=a[b],a[b]=a[d],a[d]=g;a=a.join("");return a.length==e?a:a.substr(0,e)};
	
	
function tests(){		

global.btoa = function (str) {return new Buffer(str).toString('base64');};

theString = epicRandomString('', 100000000);//50000000


		//var performance = window.performance; 
		var string = theString;
		for(j=1;j<101;j+=1){	
 i=1	//for(i=1;i<5;i++){

	theString = string.slice(0,string.length/i);
	var searchString = epicRandomString('', j);
	console.log("search length " + searchString.length);
console.log("file length " + theString.length);
t00 = process.hrtime();//console.time("regex");//var t0 = performance.now();
var rexres = regex([searchString], theString)
t01 = process.hrtime(t00)[1];//var t1 = console.timeEnd("regex");//console.log("regex " + (performance.now() - t0) + " milliseconds.")

t10 = process.hrtime();//console.time("indexof");//var t1 = performance.now();
var indexofres = indexof([searchString], theString)
t11 = process.hrtime(t10)[1];//var t2= console.timeEnd("indexof");//console.log("regex " + (performance.now() - t1) + " milliseconds.")

t20 = process.hrtime();//console.time("bmh");//var t2 = performance.now();
var bmhres = bmh([searchString], theString)
t21 = process.hrtime(t20)[1];//var t3= console.timeEnd("bmh");//console.log("regex " + (performance.now() - t2) + " milliseconds.")
//console.log(JSON.stringify(rexres)+JSON.stringify(indexofres)+JSON.stringify(bmhres));
//console.log(indexofres);
//console.log(bmhres);
 var arr =[{m:'t1','t':t01},{m:'t2','t':t11},{m:'t3','t':t21}].sort(function(a,b){return a.t-b.t;});
 console.log(arr.map(function(a){return a.m;}).concat(arr.map(function(a){return a.t;})));

//}
	}		

}