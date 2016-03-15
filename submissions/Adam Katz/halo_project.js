//Entry by Adam Katz resident of South Africa.  Intern developer at Brand Foundry.  
exports.substring_search = function(substrings, text){
//I am very new to coding (only learnt html under a year ago and javascript 6 months ago) so this probably is not a competitor to win it, but it does appear to be significantly
//better than the example code given and it was something fun to think about, so thanks for the challenge.

	var askii = {},
    i;

for (i = 32; i < 128; i++) {
    askii[String.fromCharCode(i)] = [];
}
	
	return_dict={}

	for (var i = 0; i < text.length; i++) {
		
			askii[text[i]].push(i)

	}
	substrings.forEach(s=>{
		return_dict[s]=0

		if (s[0] in askii) {
		for (var i = 0; i < askii[s[0]].length; i++) {
			if (s==text.slice(askii[s[0]][i],askii[s[0]][i]+s.length)) {
				return_dict[s]+=1
			}
		}
	}
	});
	return return_dict
	//Things I would consider adding to it, maybe instead of a dictionary a normal array where the order given is its askii value, I am unsure if this would be better
	// see if I can do a little more work on the substrings to find patterns.
	// I considered adding second letter options to the dictionary however I think the less work one does on the text part the quicker.
}












