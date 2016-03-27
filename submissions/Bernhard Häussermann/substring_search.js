exports.substring_search = function(substrings, text) {
    var counts = [];
    for (var substringIndex = 0; substringIndex < substrings.length; substringIndex++)
        counts.push(search(substrings[substringIndex], text));
    
    var result = {};
    for (var substringIndex = 0; substringIndex < substrings.length; substringIndex++)
        result[substrings[substringIndex]] = counts[substringIndex];
    return result;
}

// Boyer-Moore string search.
function search(pattern, text)
{
    var charJump = computeCharJump(pattern);
    var matchJump = computeMatchJump(pattern);
    var lastPatternCharacterOrdinal = pattern.charCodeAt(pattern.length - 1);
    var lastPatternCharacterJump = matchJump[pattern.length - 1];
    var count = 0;
    
    var textIndex = pattern.length - 1;
    while (textIndex < text.length)
    {
        var currentTextOrdinal;
        while ((currentTextOrdinal = text.charCodeAt(textIndex)) != lastPatternCharacterOrdinal)
        {
            var charJumpValue = charJump[currentTextOrdinal];
            textIndex += Math.max(charJumpValue, lastPatternCharacterJump);
            
            if (textIndex >= text.length)
                return count;
        }
        
        // Last pattern-character matched.
        textIndex--;
        var patternIndex = pattern.length - 2;
        while ((patternIndex >= 0) && (text[textIndex] == pattern[patternIndex]))
        {
            patternIndex--;
            textIndex--;
        }
        
        if (patternIndex == -1)
        {
            count++;
            textIndex += matchJump[0] + 1;
        }
        else
        {
            var charJumpValue = charJump[text.charCodeAt(textIndex)];
            var matchJumpValue = matchJump[patternIndex];
            textIndex += Math.max(charJumpValue, matchJumpValue);
        }
    }
    
    return count;
}

function computeCharJump(patternString)
{
    var charJump = new Array(128);
    for (var i = 0; i < charJump.length; i++)
        charJump[i] = patternString.length;
    for (var i = 0; i < patternString.length; i++)
        charJump[patternString.charCodeAt(i)] = patternString.length - 1 - i;
    
    return charJump;
}

function computeMatchJump(patternString)
{
    var m = patternString.length;
    var slide = new Array(m);
    for (var k = 0; k < m; k++)
        slide[k] = m;
    
    for (var k = m - 2; k >= 0; k--)
        if (patternString[k] != patternString[m - 1])
        {
            slide[slide.length - 1] = m - 1 - k;
            break;
        }
    
    // suffixIndices is 1-indexed relative to patternString.
    var suffixIndices = new Array(m + 1);
    suffixIndices[m] = m;
    var currentIndexThatStartsPattern = m;
    
    var lastAssignedSlideIndex = m;
    for (var k = m - 2; k >= -1; k--)
    {
        var s = suffixIndices[k + 2];
        while ((s < m) && (patternString[k + 1] != patternString[s]))
        {
            updateIndexIfSmaller(slide, s, s + k + 1);
            s = suffixIndices[s + 1];
        }
        s--;
        suffixIndices[k + 1] = s;

        var currentCharactersMatch = (k >= 0) && (patternString[k] == patternString[s]);
        if (!currentCharactersMatch)
        {
            updateIndexIfSmaller(slide, s, s - k);
            if (s < lastAssignedSlideIndex)
                lastAssignedSlideIndex = s;
        }
        
        var lowerBound = k >= 0 ? k : 0;
        for (var nextSlideIndex = lastAssignedSlideIndex - 1; nextSlideIndex >= lowerBound; nextSlideIndex--)
        {
            // Compute and use the first index that starts the pattern.
            for (var j = nextSlideIndex + 1; j < currentIndexThatStartsPattern; j++)
                if (startsWith(patternString, j))
                {
                    currentIndexThatStartsPattern = j;
                    break;
                };
            updateIndexIfSmaller(slide, nextSlideIndex, currentIndexThatStartsPattern);
        }
        lastAssignedSlideIndex = k;
    }
    
    var matchJump = slide;
    for (var k = 0; k < m; k++)
        matchJump[k] = slide[k] + (m - 1 - k);
    
    return matchJump;
}

function updateIndexIfSmaller(array, index, newValue)
{
    if (array[index] > newValue)
        array[index] = newValue;
}

function startsWith(text, startIndex)
{
    for (var i = 0; i < text.length - startIndex; i++)
        if (text[i] != text[i + startIndex])
            return false;
    return true;
}

