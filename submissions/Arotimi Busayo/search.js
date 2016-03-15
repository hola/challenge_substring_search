function substring_search(substrings, text) {

    var res = {},
        globalTextArray = text.split("");

    substrings.forEach(function(pattern) {

        var textArray = globalTextArray,
            patternArray = pattern.split(""),
            cachedCodeArray = convertStringToCodeArrayWithShifts(pattern),
            patternArrayLength = patternArray.length,
            count = 0;

        while (textArray.length >= patternArrayLength) {
            var mismatch = false,
                mismatchIndex = 0;
            for (i = patternArrayLength - 1; i >= 0; i--) {
                if (patternArray[i] != textArray[i]) {
                    mismatch = true;
                    mismatchIndex = i;
                    break;
                }
            }
            if (mismatch) {
                var shift = getKeyShift(pattern, cachedCodeArray, textArray[mismatchIndex]);
                textArray = textArray.slice(shift);
            } else {
                count++;
                textArray = textArray.slice(pattern.length);
            }
        }
        res[pattern] = count;
    });

    function getKeyShift (pattern, cachedCodeArray, char) {
        var charCode = String.charCodeAt(char);
        return (charCode in cachedCodeArray) ? cachedCodeArray[charCode]  :pattern.length;
    }

    function convertStringToCodeArrayWithShifts (pattern){
        var stringArray = pattern.split(""),
            stringCodeArray = {},
            i = 0,
            lengthOfString = stringArray.length;

        for(i; i <= (lengthOfString - 2); i++) {
            stringCodeArray[String.charCodeAt(stringArray[i])] = lengthOfString - 1 - i;
        }
        return stringCodeArray;
    }

    return res;
}