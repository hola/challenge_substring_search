module.exports = function(substrings,text){
	return{
		find: function() {
			var returnarray = {};
			substrings.forEach(s=>{
				var rexp = new RegExp(s, 'g');				
				var count = 0;
				while(rexp.test(text)) count++;
				returnarray[s] = count;
			});
			return returnarray;
		}
	};
}