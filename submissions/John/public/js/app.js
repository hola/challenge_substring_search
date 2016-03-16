'use strict';
/* why no fancy modules/IIFEs etc? This is way faster, and code is shorter... */
var App = function(mN,mB){ !App[mN] ? App[mN] = mB : console.warn('App NS Collision on: App.'+mN); };
App.ENV = {
	test_elements:null,
	card:null,
	res:{}
};

App('generateDocFragments',function(text){
	var docfrag = document.createDocumentFragment();
	docfrag.li = document.createElement('li');
	docfrag.a = document.createElement('a');
	if(text){
		docfrag.a.href = "#"+text;
		docfrag.a.textContent = text;
	}
	docfrag.li.appendChild(docfrag.a);
	docfrag.appendChild(docfrag.li);
	return docfrag;
});

App('parseCardComponent',function(){
	App.ENV.card = document.importNode(document.getElementById('card-template').content.childNodes[1], true);
});

App('isEqual',function(m,b){
    var aProps = Object.getOwnPropertyNames(m);
    var bProps = Object.getOwnPropertyNames(b);
	if (aProps.length != bProps.length) {
        return false;
    }
    var aPropsLen = aProps.length;
    for (var i = 0; i < aPropsLen; i++) {
        var propName = aProps[i];
	    if (m[propName] !== b[propName]) {
            return false;
        }
    }
	return true;
});

/* 
	obj:{
		machine:res.machine,
		needles:Number(res.needles.replace('n','')),
		haystack:Number(res.haystack.replace('h','').replace('k','')),
		exectime:{
			low:res.series.sort()[0],
			avg:(res.series.sort()[res.series.length - 1] + res.series.sort()[0]) * .5,
			high:res.series.sort()[res.series.length - 1]
		},
		isMatch:"Pending",
		labels:res.labels,
		series:res.series
	}
*/

App('generateCardResult',function(obj){
	App.ENV.card = document.importNode(document.getElementById('card-template').content.childNodes[1], true);
	/* map out nodes for dyndata - cause the DOM is ghetto as hell... */
	App.ENV.card.id=obj.machine;
	App.ENV.card.childNodes[0].innerHTML = obj.machine + ': <strong>' + 'n'+obj.needles + '-h'+obj.haystack+'kb' + '</strong><span>(NEEDLES: <strong>'+obj.needles+'</strong>, HAYSTACK: <strong>'+obj.haystack+'Kb</strong>)</span>'
	if(obj.series.length > 5){
		App.ENV.card.childNodes[2].innerHTML = 'Test finished in under 2000ms';
	}else{
		App.ENV.card.childNodes[2].innerHTML = 'Test did not finish in 2000ms';
	}
	App.ENV.card.childNodes[4].id = 'n'+obj.needles + 'h'+obj.haystack+'kb-'+obj.machine;
	App.ENV.card.childNodes[6].innerHTML = '<span>LOW: <strong>'+obj.exectime.low.toFixed(3)+' ms</strong> AVG: <strong>'+obj.exectime.avg.toFixed(3)+' ms</strong> HIGH: <strong>'+obj.exectime.high.toFixed(3)+' ms</strong></span>';
	if(obj.machine !== "baseline"){
		App.ENV.card.childNodes[8].innerHTML = '<span>Results Match to Baseline: <strong class="isMatch">Pending</strong></span>';
	}else{
		App.ENV.card.childNodes[8].innerHTML = '<span><strong class="isMatch">&nbsp;</strong></span>';
	}
	document.getElementsByClassName('test-container')[0].appendChild(App.ENV.card);

	/* render the graph */
	new Chartist.Line('#n'+obj.needles + 'h'+obj.haystack+'kb-'+obj.machine, {
	  labels: obj.labels,
	  series: [obj.series]
	},{low: 0,showArea: true,
		chartPadding: {
		    top: 30,
		    right: 0,
		    bottom: 30,
		    left: 10
		  },
		plugins: [
		Chartist.plugins.ctAxisTitle({
		  axisX: {
		    axisTitle: 'Interations',
		    axisClass: 'ct-axis-title',
		    offset: {
		      x: 0,
		      y: 50
		    },
		    textAnchor: 'middle'
		  },
		  axisY: {
		    axisTitle: 'Milliseconds',
		    axisClass: 'ct-axis-title',
		    offset: {
		      x: 0,
		      y: 0
		    },
		    textAnchor: 'middle'
		  }
		})
		]
	});
	if(App.ENV.res.baseline){
		document.querySelectorAll('#speedmachine .isMatch')[0].textContent = App.isEqual(App.ENV.res.speedmachine,App.ENV.res.baseline);
	}else{
		document.querySelectorAll('#speedmachine .isMatch')[0].textContent = "Pending";
	}
});



App('load',function(){
	App.getTestElements();
	App.applyBindings();
	App.parseCardComponent();
});

App('pageShow',function(){
	setTimeout(function(){
		document.body.removeAttribute('class');
		document.body.removeAttribute('style');
	},1000);
});

App('autotestSingle',function(e){
	e.preventDefault();
	App.runTest(App.ENV.test_elements.funcs,e.target.hash.replace('#',''),App.ENV);
});

App('runTest',function(machines,test){
	document.getElementsByClassName('test-container')[0].innerHTML = "";
	for (var i = machines.length - 1; i >= 0; i--) {
		$.post(window.location.origin,
			{reps:6,script:machines[i],needles:test.split("-")[0],haystack:test.split("-")[1]},
			function(res){
				res = JSON.parse(res);
				App.ENV.res[res.machine] = res.data;
				App.generateCardResult({
					machine:res.machine,
					needles:Number(res.needles.replace('n','')),
					haystack:Number(res.haystack.replace('h','').replace('k','')),
					exectime:{
						low:res.series.sort()[0],
						avg:(res.series.sort()[res.series.length - 1] + res.series.sort()[0]) * .5,
						high:res.series.sort()[res.series.length - 1]
					},
					isMatch:"Pending",
					labels:res.labels,
					series:res.series
				});
			}
		);
	};
});

App('applyBindings',function(){
	var bindings = document.querySelectorAll('[data-bind]');
	for (var i = bindings.length - 1; i >= 0; i--) {
		var b = JSON.parse(bindings[i].getAttribute('data-bind'));
		for (var prop in b){
			bindings[i].addEventListener(prop,App[b[prop]]);
		}
		b = null;
	}
	i = null;
});

App('populateParams',function(n_list,h_list){
	n_list.sort();
	h_list.sort();
	for (var i = 0; i < n_list.length; i++) {
		for (var k = 0; k < h_list.length; k++) {
			document.querySelector('.test-menu.tests').appendChild(App.generateDocFragments(n_list[i] + '-' + h_list[k]))
		}
	}
});

App('populatePlatform',function(platform){
	for (var prop in platform){
		if(prop === "network"){
			if(platform[prop].wlan0){
				document.getElementById('system-details').innerHTML += '<li>WLAN0: <span>' + platform[prop].wlan0[0].address + ':' +window.location.port + '</span></li>';
			};
			if(platform[prop].eth0){
				document.getElementById('system-details').innerHTML += '<li>ETH0: <span>' + platform[prop].eth0[0].address + ':' + window.location.port + '</span></li>';
			};
		}else{
			document.getElementById('system-details').innerHTML += '<li>' + prop + ': <span>' + platform[prop] + '</span></li>';
		}
	}
});

App('getTestElements',function(){
	$.get(window.location.origin + '/data:test_elements',function(data){
		App.ENV.test_elements = JSON.parse(data);
		App.populateParams(App.ENV.test_elements.n,App.ENV.test_elements.h);
		App.populatePlatform(App.ENV.test_elements.platform);
	});
});

window.addEventListener('load',App.load);
window.addEventListener('pageshow',App.pageShow);
