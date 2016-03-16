/* Notes 
	
	To whomever reads this:
	
	Hi!
	
	It means the world to me that someone cares enough to open this file
	in a editor somewhere across the globe. We deal with so much in a day, and you
	dear reader, you deem reading this, as worthy of your time, and for that
	I thank you kindly.

	FAULT TOLERANCE====================================================================

	I wrote this as a test server, its NOT meant to go near a production/public server,
	that being said error trapping / try catches are kept to a minimum and there
	are global variables present.

	If it breaks email me(john@magneticnorth.io), or hack away at the code until it works.

	WHY BUILD A TESTING SERVER FOR A SINGLE NODE MODULE? ==============================
	
	Writing a single node module of this size is not enough of a challenge :)
	Understanding how and why it works fast, and testing it, thats more fun.

*/

const http = require('http'),
		fs = require('fs'),
		url = require('url'),
		os = require('os'),
		path = require('path'),
		portfinder = require('portfinder'),
		colors = require('colors/safe'),
		mimeTypes = {
			'html': 'text/html',
			'js'  : 'text/javascript',
		    'css' : 'text/css',
		    'png' : 'image/png',
		    'jpg' : 'image/jpg',
		    'ico' : 'image/ico'
		};

var benchOpts = {},
	jsonString = "",
	benchtest = {},
	laptimeStart = [],
	laptimeEnd = [],
	raceResults = [],
	alias = {
		test_functions:[],
		n_list:[],
		h_list:[]
	};

/* 
	here we load the scripts dynamically, so feel free to add more to the directory ;) 
	each file is registered as its filename eg. speedmachine.js is alias["speedmachine"]
*/
fs.readdirSync(path.join(__dirname,'custom_modules/')).forEach(function (file) {
	alias[file.replace('.js','')] = require(path.join(__dirname,'custom_modules/',file));
	alias.test_functions.push(file.replace('.js',''));
});

/* 
	here we load in the needles and haystacks
	each file is registered as its file name, 
	eg. needles/5.txt is alias["n5"]
		haystacks/50K.txt is alias["h500k"] <- note lowercase
*/

/* needles */
fs.readdirSync(path.join(__dirname,'testdata/needles')).forEach(function(file){
	alias.n_list.push('n'+file.replace('.txt','').toLowerCase());
	fs.readFile(path.join(__dirname,'testdata/needles/',file),'utf8',function(err,data){
		if(err) throw err;
		alias['n'+file.replace('.txt','').toLowerCase()] = data.split(" ");
	});
});

/* haystacks */
fs.readdirSync(path.join(__dirname,'testdata/haystacks')).forEach(function(file){
	alias.h_list.push('h'+file.replace('.txt','').toLowerCase());
	fs.readFile(path.join(__dirname,'testdata/haystacks/',file),'utf8',function(err,data){
		if(err) throw err;
		alias['h'+file.replace('.txt','').toLowerCase()] = data;
	});
});


/* benchmarking functions */
/* https://nodejs.org/api/process.html#process_process_hrtime */
benchtest = {
	run:function(){
		raceResults = [];
		var len = benchOpts.reps;
		var labels = [];
		var counter = 0;
		var data;
		/* ladies and gentlemen, start your engines */
		while(len--){
			if(raceResults && raceResults[0] > 1000){break;};
			counter++;
			laptimeStart = process.hrtime();
			data = alias[benchOpts.script].substring_search(alias[benchOpts.needles],alias[benchOpts.haystack]);
			laptimeEnd = process.hrtime(laptimeStart);
			labels.push(counter);
			raceResults.push(Number(((laptimeEnd[0] * 1e9 + laptimeEnd[1]) * 1.0e-6).toFixed(3)));
			/* break if script is running too long */
			if(laptimeEnd[1] > 1e+9){break;}
		}
		return {
			machine:benchOpts.script,
			needles:benchOpts.needles,
			haystack:benchOpts.haystack,
			labels:labels,
			series:raceResults,
			data:data

		};
		/* the line below is to see the benchmark numbers for every iteration, your terminal might go crazy */
		//console.log('benchmark took %d milliseconds', (laptimeEnd[0] * 1e9 + laptimeEnd[1]) * 1.0e-6);
	}
};

/* look for an open port, cause ya never know... */
portfinder.getPort(function (err, port) {
	http.createServer(function (req, res) {
		if(req.method === 'GET'){
			if(req.url.split(":").length > 1){
				res.writeHead(200, {"Content-Type": "application/json"});
				res.end(JSON.stringify(
					{
						funcs:alias.test_functions,
						n:alias.n_list,
						h:alias.h_list,
						platform:{
							arch:process.arch,
							cpu:os.cpus()[0].model,
							network:os.networkInterfaces(),
							platform:process.platform,
							release:os.release()
						}
					}));
			}else{
				if(req.url === '/'){
					var filePath = __dirname + '/public' + req.url + 'index.html';
				}else{
					var filePath = __dirname + '/public' + req.url;
				}

				// if the server crashes on reload due to bad file path
				// console.log(filePath);

				var readStream = fs.createReadStream(filePath);
					readStream.on('open', function () {
						res.setHeader('Content-Type', mimeTypes[filePath.split('.').pop()]);
						res.writeHead(200);
						readStream.pipe(res);
					});
					readStream.on('error', function(err) {
						res.end(err);
					});
				}
		}

		if(req.method === 'POST'){
			jsonString = '';

			req.on('data', function (data) {
				jsonString += data;
			});

			req.on('end', function () {
				benchOpts = {};
				jsonString.split('&').forEach(function(opt){
					benchOpts[opt.split('=')[0]] = opt.split('=')[1]; 
				});
				res.writeHead(200, {'Content-Type': 'text/plain'});
				res.end(JSON.stringify(benchtest.run()));
    			req.pipe(res);
			});

		}

	}).listen(port);

	console.log(colors.white('Benchmark Server Running - ') + colors.green('http://localhost:')+ colors.green.bold(port));
	console.log(colors.yellow('Press Ctrl+C to stop it.'));

});