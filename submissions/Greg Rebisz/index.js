const substringer = require('./substring_searchmod')
var substrq = substringer(['gsm', 'phone', 's', 'm-p'], 'gsm-phones: Using a GSM phone in USA may be problematic');
console.log(substrq.find());
