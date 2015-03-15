A standalone implementation of hash table in JavaScript. It associates keys with values, and allows any object to be used as the key (unlike JavaScript's built-in Object, which only allows strings as property names).

Also included is a hash set implementation, implemented by wrapping the keys of a hash table.

jshashtable requires no libraries and is designed to work in all ECMAScript 3 compliant environments, including all major browsers and Node.js. In particular, it has been tested and works in:

  * Firefox (all versions, back to Phoenix 0.1)
  * Internet Explorer 5.5+
  * Safari 3+ (untested in previous versions)
  * Google Chrome (all versions)
  * Opera 7+

See the [jshashtable website](http://www.timdown.co.uk/jshashtable/index.html) for full documentation.

## Version 3.0 released ##

Version 3.0 is released today (16th July 2013). It fixes [issue 2](https://code.google.com/p/jshashtable/issues/detail?id=2), [issue 3](https://code.google.com/p/jshashtable/issues/detail?id=3), [issue 5](https://code.google.com/p/jshashtable/issues/detail?id=5), [issue 6](https://code.google.com/p/jshashtable/issues/detail?id=6), [issue 7](https://code.google.com/p/jshashtable/issues/detail?id=7), adds new `equals()` and `toQueryString()` methods and drops support for IE 5.0. Also includes jshashset and documentation in the zip.
