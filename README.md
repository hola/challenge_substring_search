# Hola JS Africa Challenge: substring search

Welcome to Hola's new JS programming challenge! Do you have the skills to write the fastest code? There's prize money at stake:

* First prize: **1000 USD**.
* Second prize: **700 USD**.
* Third prize: **350 USD**.
* We might also decide to award a 200 USD special prize for an exceptionally creative approach.

Refer a friend to this page by email, and include africa+gh@hola.org in CC, and if he wins, you will win the same amount too!

For Hola, it's a chance to get to know many talented programmers, and to invite those who submit good code for job interviews.

# Rules

The fastest code, as long as it passes our correctness tests, wins.

* This challenge is open all residents of all countries in **Africa**.
  If you live elsewhere you are still
  welcome to submit your solution for fun - it will be evaluated and scored,
  but will not be eligible for a prize.
  We will contact winners for proof of residency.
* Send your solution to africa+gh@hola.org.
* Submission deadline: **March 10, 2016**, 23:59:59 UTC.
  * Winner evaluation test-suite will be publicized on March 14, 2016.
    This will include initial (non-final) performance results.
  * Public discussion on test-suite, and adjustments according to valid feedback until March 21, 2016.
    This is to eliminate every possible way for subjective judgment to affect the outcome.
  * Final performance results and **winners** will be publicized on **March 28, 2016**.
* You may submit more than once. Only your latest submission, as long as it's still before the deadline, will be evaluated.
* We will use **Node.js v5.5.0** (stable release at the time of this publication) for testing.
  You are allowed to use any language features available with V8 default settings.
* Your code must all be in a **single JS file**.
* Submission must be in JS rather than CoffeeScript or similar.
  If you prefer those languages, translate to JS before submitting -
  and attach your source in the original language (in addition to, not instead of JS).
  Only your JS file will be tested.
* It is **not allowed to require any JS modules**, not even the standard ones built into Node.js.
* We will test your solution for both correctness and performance. Only solutions that pass the correctness
  testing will be admitted to performance testing. The fastest of the correct solutions wins.
* All submissions, as well as our correctness and performance tests, will be published after the end
  of the competition.
* Your full name (or a pseudonym if you sign your solution with one), but not your e-mail address,
  will be published.
* Do not publish your solution before the submission deadline, or you will be disqualified.
* If the problem statement seems ambiguous, check our reference implementation instead of asking
  us questions; but please do tell us if you suspect that the reference implementation
  contradicts this problem statement for a certain input.

# Problem Statement

You are in charge of developing a search engine. Your task is to write a Node.js module exporting one single function:
```javascript
substring_search(substrings, text)
```
Which will count occurrences of substrings in large multi-megabyte text files,
and will return the number of occurrences of the substrings in text, case-sensitive.

Valid input, which you can optimize/tune for:
Anything that passes
[valid_input.js](https://github.com/hola/challenge_substring_search/blob/master/valid_input.js)
* No more than 100 substrings, up to 100 in length
* Strings contain only ASCII characters between 0x20 and 0x7F.
Solution may have undefined behavior on non-valid input.

## Example
```javascript
substring_search(['gsm', 'phone', 's'], '')
```
should return `{gsm: 0, phone: 0, s: 0}`

```javascript
substring_search(['gsm', 'phone', 's', 'm-p'], 'gsm-phones: Using a GSM phone in USA may be problematic')
```
should return `{gsm: 1, phone: 2: s: 4, 'm-p': 1}`

## Reference implementation
```javascript
exports.substring_search = function(substrings, text){
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
```

# More about Hola!

Hola was founded by serial entrepreneurs with the goal of making a better Internet.
Hola's overlay P2P network for HTTP has disrupted the [consumer VPN](http://hola.org)
and [online business intelligence](http://luminati.io) markets,
and is [on its way to disrupting the $5B/yr CDN market](http://holacdn.com).
Hola is well funded and profitable ([read more about us](http://hola.org/about)).

# Our previous challenges

* [JS mail filter](http://hola.org/challenge_mail_filter)
  ([Results](https://github.com/hola/challenge_mail_filter)) (ended December 25,2015)
* [Generalize Node.js' linked list](https://github.com/hola/challenge_linked_list) (ended June 30, 2015)
* [Make JS strftime 50x faster](https://github.com/hola/challenge_strftime) (ended June 22, 2014)
* [str_cpy & str_cat C challenge](http://hola.org/challenge_c) ([Winners](http://hola.org/winners)) (running & giving prizes during 2012-2014)

