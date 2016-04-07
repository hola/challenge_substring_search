# Hola JS Africa Challenge: substring search

Welcome to Hola's new JS programming challenge! Do you have the skills to write the fastest code? There's prize money at stake:

* First prize: **1000 USD**.
* Second prize: **700 USD**.
* Third prize: **350 USD**.
* We might also decide to award a **200 USD** special prize for an exceptionally creative approach.

Refer a friend to this page by email, include africa+gh@hola.org in CC, and if they win, you will receive the same amount, too!

For Hola, it's a chance to get to know many talented programmers, and to invite those who submit good code for job interviews.

# Rules

The fastest code, as long as it passes our correctness tests, wins.

* This challenge is open to residents of all countries in **Africa**.
  If you live elsewhere you are still welcome to submit your solution for fun; it will be evaluated and ranked,
  but will not be eligible for a prize.
  We will contact winners for proof of residency.
* Send your solution to africa+gh@hola.org.
* Submission deadline: **March 10, 2016**, 23:59:59 UTC.
  * Our test-suite will be publicized on **March 14, 2016**.
    This will include initial (non-final) performance results.
  * Public discussion of the test-suite will happen next (delayed to **March 26**). We expect feedback
    until **March 21, 2016** (delayed to **April 2**), and may make adjustments based on well-founded
    comments. This is to eliminate every possible way for subjective judgment
    to affect the outcome.
  * Final performance results and **winners** will be publicized on **March 28, 2016** (delayed to **April 9**).
* You may submit more than once. Only your latest submission, as long as it's still before the deadline, will be evaluated.
* We will use **Node.js v5.5.0** (stable release at the time of this publication) for testing.
  You are allowed to use any language features available with V8 default settings.
* Your code must all be in a **single JS file**.
* Submission must be in JS rather than CoffeeScript or similar.
  If you prefer those languages, translate to JS before submitting,
  and attach your source in the original language (in addition to, not instead of JS).
  Only your JS file will be tested.
* It is **not allowed to require any JS modules**, not even the standard ones built into Node.js.
* We will test your solution for both correctness and performance. Only solutions that pass the correctness
  testing will be admitted to performance testing. The fastest of the correct solutions wins.
* All submissions, as well as our correctness and performance tests, will be published after the end
  of the competition.
* Your full name (or a pseudonym if you sign your solution with one), but not your e-mail address,
  will be published. Please don't forget to tell us your name or the pseudonym you'd like to use.
* Do not publish your solution before the submission deadline, or you will be disqualified.
* If the problem statement seems ambiguous, check our reference implementation instead of asking
  us questions; but please do tell us if you suspect that the reference implementation
  contradicts this problem statement for a certain input.

# Problem Statement

You are in charge of developing a search engine. Your task is to write a Node.js module exporting one single function:
```javascript
substring_search(substrings, text)
```
…which will count occurrences of substrings in a large multi-megabyte text,
and will return the number of occurrences of each substring in the text, case-sensitive.

Valid input, which you can optimize/tune for:
Anything that passes
[valid_input.js](https://github.com/hola/challenge_substring_search/blob/master/valid_input.js)
* No more than 100 substrings, up to 100 in length
* Strings contain only ASCII characters between 0x20 and 0x7F.
Solution may have undefined behavior on invalid input.

## Example
```javascript
substring_search(['gsm', 'phone', 's'], '')
```
…should return `{gsm: 0, phone: 0, s: 0}`.

```javascript
substring_search(['gsm', 'phone', 's', 'm-p'], 'gsm-phones: Using a GSM phone in USA may be problematic')
```
…should return `{gsm: 1, phone: 2, s: 3, 'm-p': 1}`.

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

* [JS mail filter](https://github.com/hola/challenge_mail_filter) (ended December 25, 2015)
* [Generalize Node.js' linked list](https://github.com/hola/challenge_linked_list) (ended June 30, 2015)
* [Make JS strftime 50x faster](https://github.com/hola/challenge_strftime) (ended June 22, 2014)
* [str_cpy & str_cat C challenge](https://github.com/hola/challenge_c) (2012–2014)

# Final Results

## The Testing methodology
The correctness and performance tests were automatic. Correctness is tested by `tests/correctness.js` and performance by `tests/performance.js`.

Our reference implementation is included here as `tests/reference.js`.

### Correctness
The correctness tests can be found in the body of `tests/correctness.js`.

Unfortunately, many of the submissions failed on one or another corner case. Syntax errors, use of `require` (forbidden by the rules). If you are wondering why a particular solution failed, you can run the test program on the solution file and see the output.

Note that a few solutions passed the correctness tests but still produced wrong results in the performance tests; these were treated as having failed correctness.

### Performance
The inputs for the performance tests were generated by `tests/generate_large.js`; to produce the expected outputs, the reference implementation was used.  We didn't include the test data files because of their size, but you can run the generating script to recreate exactly the same content as we used.

The haystack is the full works of William Shakespeare downloaded from Project Gutenberg, converted to lowercase (to increase the incidence of partial matches), and with all forbidden characters removed (notably, newlines). 100 needles were generated, some of these being actual randomly chosen substrings from the haystack, and some generated using Markov chains trained on the haystack. A pseudorandom generator with a fixed seed was used, so the output of `generate_large.js` is deterministic.

The performance tests were run on a 3.4 GHz Intel Core i3 machine running 64-bit Ubuntu 14.04. Each submission was run 10 times (in 10 separate runs of `tests/performance.js`), and the best time was selected. The time excludes the reading of the test data by the script, and the result validation.

With the full 5.5 MB body of Shakespeare's works as the haystack, many of the solutions ran so fast that their running times were indistinguishable. We tested then with the same needles but with 20 copies of Shakespeare concatenated as haystack. 20× seemed to be the maximum input size at which all solutions still worked; at bigger inputs, some of them began to run out of memory with default V8 settings. Because we didn't require support for any particular minimal input size, we decided to stop at 20×. Still, at 20× input, some of the solutions had indistinguishable runtimes; most importantly, this included two contenders for the second place. We found that increasing the input size to 32× allows us to distinguish between them. However, at that size, one solution ran out of memory, and another one took forever to run (we gave up waiting after 30 minutes). For this reason, we decided to stick with 20×, but for the cases where the best times of two solutions were closer together than the biggest of their standard deviations, we looked at the 32× resluts for those two. The 32× test still didn't allow us to distinguish between two of the solutions.

The raw results of the performance measurements for every run of every solution can be found in `raw_results.json`.

## Current results (will be finilized after completion of public discussion)

Only the solutions that passed the correctness tests are assigned a rank in the table below.

Place | Name                                |  1× time, ms | 20× time, ms | 32× time, ms | Remark
-----:|-------------------------------------|-------------:|-------------:|-------------:|-------------------
    1 | Joran Dirk Greef                    |           76 |         1356 |         1945 | **1000 USD prize**
    2 | Ralf Kistner                        |           77 |         1435 |         3613 | **700 USD prize**
    3 | Mike Yudaken                        |           79 |         1435 |         3709 | **350 USD prize**
    4 | Anton Koekemoer                     |          138 |         2601 |         5168 |
    5 | Gregg Jansen Van Vüren              |          525 |         3045 |        19767 |
    6 | Ken Ramela                          |          230 |         3346 |         7559 |
    7 | cr1s                                |          164 |         3433 |         5634 |
    8 | Simon Buerger                       |          164 |         3434 |         5635 |
    9 | Nolan Pather                        |          186 |         3437 |         5643 |
   10 | Justin Lovell                       |          174 |         3569 |         6160 |
   11 | Bernhard Häussermann                |          209 |         4214 |         6595 |
   12 | Daniel Lawrence                     |          230 |         4434 |         8102 |
   13 | Richard Pierce-Jones                |          847 |        17228 |        27424 |
   14 | Arthur Okeke                        |          913 |        17704 |        28304 |
   15 | Gerard Louw                         |          872 |        18729 |        28431 |
   16 | Adam Katz                           |         1820 |        40436 |  (very long) |
   17 | Guillaume                           |         3534 |        74795 |       115091 |
   18 | Ezinwa Okpoechi                     |         5032 |       157092 |       405820 |
   19 | kywedol                             |        10854 |       224357 |        (OOM) |
      | Abdul Mueid                         |              |              |              |
      | Abimbola Idowu                      |              |              |              |
      | Agustin Cassani                     |              |              |              | Hors concours
      | Alex Schana                         |              |              |              |
      | Andre Ogle                          |              |              |              |
      | Arlon Mukeba                        |              |              |              |
      | Arotimi Busayo                      |              |              |              |
      | Barry Doyle                         |              |              |              |
      | Bbundi                              |              |              |              |
      | Brad Roodt                          |              |              |              |
      | Brendan Bell                        |              |              |              |
      | Brian Nyaundi                       |              |              |              |
      | Charles Okot                        |              |              |              |
      | Chris Brand                         |              |              |              |
      | Christo Goosen                      |              |              |              |
      | Coert Grobbelaar                    |              |              |              |
      | Cornelius van Heerden               |              |              |              |
      | Eni Arinde                          |              |              |              |
      | Gareth McCumskey                    |              |              |              |
      | Greg Rebisz                         |              |              |              |
      | Gustav Bertram                      |              |              |              |
      | John                                |              |              |              |
      | Jono Booth                          |              |              |              |
      | Kenneth Nnani                       |              |              |              |
      | Kobus Pretorius                     |              |              |              |
      | Lawrence nyakiso                    |              |              |              |
      | Lukas Havenga                       |              |              |              |
      | Mbah Emeka Anthony                  |              |              |              |
      | Melcom van Eeden                    |              |              |              |
      | Rory Gilfillan                      |              |              |              |
      | Shailesh shekhawat                  |              |              |              |
      | Ziv Perry                           |              |              |              | Hors concours
