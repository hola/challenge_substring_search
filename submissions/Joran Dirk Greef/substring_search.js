// Copyright (c) 2016 Joran Dirk Greef.
// All rights reserved.
// This software may be modified and distributed
// under the terms of the MIT license.

exports.substring_search = function(substrings, text) {
  "use strict";
  var results = {};
  var textLength = text.length;
  var substringsLength = substrings.length;
  var brute = false;
  if (textLength <= 10000) {
    if (substringsLength <= 100) brute = true;
  } else if (textLength <= 16000) {
    if (substringsLength <= 96) brute = true;
  } else if (textLength <= 30000) {
    if (substringsLength <= 60) brute = true;
  } else if (textLength <= 90000) {
    if (substringsLength <= 30) brute = true;
  } else if (textLength <= 50000000) {
    if (substringsLength <= 20) brute = true;
  } else {
    if (substringsLength <= 16) brute = true;
  }
  if (brute) {
    for (var index = 0, length = substrings.length; index < length; index++) {
      var substring = substrings[index];
      var n = 0;
      var pos = 0;
      while ((pos = text.indexOf(substring, pos)) >= 0) {
        n++;
        pos++;
      }
      results[substring] = n;
    }
    return results;
  }
  text = new Buffer(text, 'ascii');
  var codeFloor = 32;
  var codeCeiling = 127;
  var codeMax = codeCeiling - codeFloor;
  var codeRange = codeMax + 1;
  var matchesLength = ((codeMax << 8) | codeMax) + 1;
  var matches = new Array(matchesLength);
  var indexes = new Array(matchesLength);
  var length = matchesLength;
  while (length--) {
    matches[length] = 0;
    indexes[length] = 0;
  }
  var countLetters = false;
  for (var index = 0, length = substrings.length; index < length; index++) {
    var substring = substrings[index];
    if (substring.length === 1) {
      countLetters = true;
    } else {
      var buffer = new Buffer(substring, 'ascii');
      var hash = ((buffer[0] - codeFloor) << 8) | (buffer[1] - codeFloor);
      if (!matches[hash]) matches[hash] = [];
      matches[hash].push(buffer);
      if (!indexes[hash]) indexes[hash] = [];
      indexes[hash].push(index);
    }
  }
  var letters = new Uint32Array(codeRange);
  var phrases = new Uint32Array(substrings.length);
  var code = 0;
  var hash = 0;
  var buffers;
  var buffersIndex = 0;
  var buffersLength = 0;
  var buffer;
  var bufferIndex = 0;
  var bufferLength = 0;
  var searchIndex = 0;
  var index = 0;
  var length = text.length;
  if (countLetters) {
    while (index < length - 1) {
      code = text[index] - codeFloor;
      letters[code]++;
      hash = (code << 8) | (text[++index] - codeFloor);
      buffers = matches[hash];
      if (buffers) {
        buffersIndex = 0;
        buffersLength = buffers.length;
        outer:
        while (buffersIndex < buffersLength) {
          buffer = buffers[buffersIndex++];
          bufferIndex = 0;
          bufferLength = buffer.length;
          searchIndex = index - 1;
          if (length - searchIndex >= bufferLength) {
            bufferIndex += 2;
            searchIndex += 2;
            while (bufferIndex < bufferLength) {
              if (buffer[bufferIndex++] != text[searchIndex++]) continue outer;
            }
            phrases[indexes[hash][buffersIndex - 1]]++;
          }
        }
      }
    }
  } else {
    while (index < length - 1) {
      code = text[index] - codeFloor;
      hash = (code << 8) | (text[++index] - codeFloor);
      buffers = matches[hash];
      if (buffers) {
        buffersIndex = 0;
        buffersLength = buffers.length;
        outer:
        while (buffersIndex < buffersLength) {
          buffer = buffers[buffersIndex++];
          bufferIndex = 0;
          bufferLength = buffer.length;
          searchIndex = index - 1;
          if (length - searchIndex >= bufferLength) {
            bufferIndex += 2;
            searchIndex += 2;
            while (bufferIndex < bufferLength) {
              if (buffer[bufferIndex++] != text[searchIndex++]) continue outer;
            }
            phrases[indexes[hash][buffersIndex - 1]]++;
          }
        }
      }
    }
  }
  if (countLetters) {
    code = text[index] - codeFloor;
    letters[code]++;
  }
  for (var index = 0, length = substrings.length; index < length; index++) {
    var substring = substrings[index];
    if (substring.length == 1) {
      results[substring] = letters[substring.charCodeAt(0) - codeFloor];
    } else {
      results[substring] = phrases[index];
    }
  }
  return results;
};
