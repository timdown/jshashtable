/**
 * @license jahashtable, a JavaScript implementation of a hash table. It creates a single constructor function called
 * Hashtable in the global scope.
 *
 * http://www.timdown.co.uk/jshashtable/
 * Copyright 2010 Tim Down.
 * Version: %%build:version%%
 * Build date: %%build:date%%
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var Hashtable = (function() {
	var FUNCTION = "function", STRING = "string", UNDEF = "undefined";

	var arrayRemoveAt = (typeof Array.prototype.splice == FUNCTION) ?
		function(arr, idx) {
			arr.splice(idx, 1);
		} :

		function(arr, idx) {
			var itemsAfterDeleted, i, len;
			if (idx === arr.length - 1) {
				arr.length = idx;
			} else {
				itemsAfterDeleted = arr.slice(idx + 1);
				arr.length = idx;
				for (i = 0, len = itemsAfterDeleted.length; i < len; ++i) {
					arr[idx + i] = itemsAfterDeleted[i];
				}
			}
		};

    function toStr(obj) {
        if (typeof obj == STRING) {
            return obj;
        } else if (typeof obj.toString == FUNCTION) {
			return obj.toString();
		} else {
			try {
				return String(obj);
			} catch (ex) {
				// For host objects (such as ActiveObjects in IE) that have no toString() method and throw an error when
				// passed to String()
				return Object.prototype.toString.call(obj);
			}
		}
    }

	function hashObject(obj) {
		var hashCode;
		if (typeof obj == STRING) {
			return obj;
		} else if (typeof obj.hashCode == FUNCTION) {
			// Check the hashCode method really has returned a string
			hashCode = obj.hashCode();
			return (typeof hashCode == STRING) ? hashCode : hashObject(hashCode);
		} else {
            return toStr(obj);
		}
	}

	function equals_fixedValueHasEquals(fixedValue, variableValue) {
		return fixedValue.equals(variableValue);
	}

	function equals_fixedValueNoEquals(fixedValue, variableValue) {
		return (typeof variableValue.equals == FUNCTION) ?
			   variableValue.equals(fixedValue) : (fixedValue === variableValue);
	}

	function createKeyValCheck(kvStr) {
		return function(kv) {
			if (kv === null) {
				throw new Error("null is not a valid " + kvStr);
			} else if (typeof kv == UNDEF) {
				throw new Error(kvStr + " must not be undefined");
			}
		};
	}

	var checkKey = createKeyValCheck("key"), checkValue = createKeyValCheck("value");

	/*----------------------------------------------------------------------------------------------------------------*/

	function Bucket(hash, firstKey, firstValue, equalityFunction) {
        if (typeof hash != UNDEF) {
            this[0] = hash;
            this.entries = [];
            this.addEntry(firstKey, firstValue);

            if (equalityFunction !== null) {
                this.getEqualityFunction = function() {
                    return equalityFunction;
                };
            }
        }
	}

	var EXISTENCE = 0, ENTRY = 1, ENTRY_INDEX_AND_VALUE = 2;

	function createBucketSearcher(mode) {
		return function(key) {
			var i = this.entries.length, entry, equals = this.getEqualityFunction(key);
			while (i--) {
				entry = this.entries[i];
				if ( equals(key, entry[0]) ) {
					switch (mode) {
						case EXISTENCE:
							return true;
						case ENTRY:
							return entry;
						case ENTRY_INDEX_AND_VALUE:
							return [ i, entry[1] ];
					}
				}
			}
			return false;
		};
	}

	function createBucketLister(entryProperty) {
		return function(aggregatedArr) {
			var startIndex = aggregatedArr.length;
			for (var i = 0, len = this.entries.length; i < len; ++i) {
				aggregatedArr[startIndex + i] = this.entries[i][entryProperty];
			}
		};
	}

	Bucket.prototype = {
		getEqualityFunction: function(searchValue) {
			return (typeof searchValue.equals == FUNCTION) ? equals_fixedValueHasEquals : equals_fixedValueNoEquals;
		},

		getEntryForKey: createBucketSearcher(ENTRY),

		getEntryAndIndexForKey: createBucketSearcher(ENTRY_INDEX_AND_VALUE),

		removeEntryForKey: function(key) {
			var result = this.getEntryAndIndexForKey(key);
			if (result) {
				arrayRemoveAt(this.entries, result[0]);
				return result[1];
			}
			return null;
		},

		addEntry: function(key, value) {
			this.entries[this.entries.length] = [key, value];
		},

		keys: createBucketLister(0),

		values: createBucketLister(1),

		getEntries: function(entries) {
			var startIndex = entries.length;
			for (var i = 0, len = this.entries.length; i < len; ++i) {
				// Clone the entry stored in the bucket before adding to array
				entries[startIndex + i] = this.entries[i].slice(0);
			}
		},

		containsKey: createBucketSearcher(EXISTENCE),

		containsValue: function(value) {
			var i = this.entries.length;
			while (i--) {
				if ( value === this.entries[i][1] ) {
					return true;
				}
			}
			return false;
		},

        isEmpty: function() {
            return this.entries.length == 0;
        }
	};

    /*----------------------------------------------------------------------------------------------------------------*/

    function SimpleBucket(hash, firstKey, firstValue) {
        this[0] = hash;
        this.values = [];
        this.keys = [];
        this.addEntry(firstKey, firstValue);
    }

    function getSearcherReturnValue(key, values, index, mode) {
        switch (mode) {
            case EXISTENCE:
                return true;
            case ENTRY:
                return [ key,  values[index] ];
            case ENTRY_INDEX_AND_VALUE:
                return [ index, values[index] ];
        }
    }

    var createSimpleBucketSearcher = Array.prototype.indexOf ?
        function(mode) {
            return function(key) {
                var index = this.keys.indexOf(key);
                if (index == -1) {
                    return false;
                } else {
                    return getSearcherReturnValue(key, this.values, index, mode);
                }
            };
        } :

        function(mode) {
            return function(key) {
                var i = this.keys.length, bucketKey;
                while (i--) {
                    bucketKey = this.keys[i];
                    if (bucketKey === key) {
                        return getSearcherReturnValue(key, this.values, i, mode);
                    }
                }
                return false;
            };
        };

    var simpleProto = SimpleBucket.prototype = new Bucket();

    simpleProto.getEntryForKey = createSimpleBucketSearcher(ENTRY);

    simpleProto.getEntryAndIndexForKey = createSimpleBucketSearcher(ENTRY_INDEX_AND_VALUE);

    simpleProto.removeEntryForKey = function(key) {
        var result = this.getEntryAndIndexForKey(key);
        if (result) {
            arrayRemoveAt(this.keys, result[0]);
            arrayRemoveAt(this.values, result[0]);
            return result[1];
        }
        return null;
    };

    simpleProto.addEntry = function(key, value) {
        this.keys[this.keys.length] = key;
        this.values[this.values.length] = value;
    };

    simpleProto.keys = function() {
        return this.keys.slice(0);
    };

    simpleProto.values = function() {
        return this.values.slice(0);
    };

    simpleProto.getEntries = function(entries) {
        var keys = this.keys, vals = this.values, startIndex = entries.length;
        for (var i = 0, len = keys.length; i < len; ++i) {
            entries[startIndex + i] = [ keys[i], vals[i] ];
        }
    };

    simpleProto.containsKey = createSimpleBucketSearcher(EXISTENCE);

    simpleProto.containsValue = Array.prototype.indexOf ?
        function(value) {
            return this.values.indexOf(value) > -1;
        } :

        function(value) {
            var vals = this.values, i = vals.length;
            while (i--) {
                if (vals[i] === value) {
                    return true;
                }
            }
            return false;
        };

    simpleProto.isEmpty = function() {
        return this.keys.length == 0;
    };

	/*----------------------------------------------------------------------------------------------------------------*/

	// Supporting functions for searching hashtable buckets

	function searchBuckets(buckets, hash) {
		var i = buckets.length, bucket;
		while (i--) {
			bucket = buckets[i];
			if (hash === bucket[0]) {
				return i;
			}
		}
		return null;
	}

	function getBucketForHash(bucketsByHash, hash) {
		var bucket = bucketsByHash[hash];

		// Check that this is a genuine bucket and not something inherited from the bucketsByHash's prototype
		return ( bucket && (bucket instanceof Bucket) ) ? bucket : null;
	}

	/*----------------------------------------------------------------------------------------------------------------*/

	function Hashtable() {
		var buckets = [];
		var bucketsByHash = {};
        var hashingFunction, equalityFunction = null, useKeyEqualsMethod = true, simpleBuckets = false;
        var properties = {
            hashingFunction: hashObject,
            equalityFunction: null,
            useKeyEqualsMethod: true
        };

        this.properties = properties;

        if (typeof arguments[1] != UNDEF) {
            properties.hashingFunction = arguments[0];
            properties.equalityFunction = arguments[1];
        } else if (typeof arguments[0] != UNDEF) {
            properties = arguments[0];
        }

        hashingFunction = properties.hashingFunction || hashObject;
        equalityFunction = properties.equalityFunction || null;
        useKeyEqualsMethod = (typeof properties.useKeyEqualsMethod == UNDEF) ? true : properties.useKeyEqualsMethod;
        simpleBuckets = !equalityFunction && !useKeyEqualsMethod;

		this.put = function(key, value) {
			checkKey(key);
			checkValue(value);
			var hash = hashingFunction(key), bucket, bucketEntry, oldValue = null;

			// Check if a bucket exists for the bucket key
			bucket = getBucketForHash(bucketsByHash, hash);
			if (bucket) {
				// Check this bucket to see if it already contains this key
				bucketEntry = bucket.getEntryForKey(key);
				if (bucketEntry) {
					// This bucket entry is the current mapping of key to value, so replace old value and we're done.
					oldValue = bucketEntry[1];
					bucketEntry[1] = value;
				} else {
					// The bucket does not contain an entry for this key, so add one
					bucket.addEntry(key, value);
				}
			} else {
				// No bucket exists for the key, so create one and put our key/value mapping in
                bucket = simpleBuckets ?
                         new SimpleBucket(hash, key, value) : new Bucket(hash, key, value, equalityFunction);
				buckets[buckets.length] = bucket;
				bucketsByHash[hash] = bucket;
			}
			return oldValue;
		};

		this.get = function(key) {
			checkKey(key);

			var hash = hashingFunction(key);

			// Check if a bucket exists for the bucket key
			var bucket = getBucketForHash(bucketsByHash, hash);
			if (bucket) {
				// Check this bucket to see if it contains this key
				var bucketEntry = bucket.getEntryForKey(key);
				if (bucketEntry) {
					// This bucket entry is the current mapping of key to value, so return the value.
					return bucketEntry[1];
				}
			}
			return null;
		};

		this.containsKey = function(key) {
			checkKey(key);
			var bucketKey = hashingFunction(key);

			// Check if a bucket exists for the bucket key
			var bucket = getBucketForHash(bucketsByHash, bucketKey);

			return bucket ? bucket.containsKey(key) : false;
		};

		this.containsValue = function(value) {
			checkValue(value);
			var i = buckets.length;
			while (i--) {
				if (buckets[i].containsValue(value)) {
					return true;
				}
			}
			return false;
		};

		this.clear = function() {
			buckets.length = 0;
			bucketsByHash = {};
		};

		this.isEmpty = function() {
			return !buckets.length;
		};

		var createBucketAggregator = function(bucketFuncName) {
			return function() {
				var aggregated = [], i = buckets.length;
				while (i--) {
					buckets[i][bucketFuncName](aggregated);
				}
				return aggregated;
			};
		};

		this.keys = createBucketAggregator("keys");
		this.values = createBucketAggregator("values");
		this.entries = createBucketAggregator("getEntries");

		this.remove = function(key) {
			checkKey(key);

			var hash = hashingFunction(key), bucketIndex, oldValue = null;

			// Check if a bucket exists for the bucket key
			var bucket = getBucketForHash(bucketsByHash, hash);

			if (bucket) {
				// Remove entry from this bucket for this key
				oldValue = bucket.removeEntryForKey(key);
				if (oldValue !== null) {
					// Entry was removed, so check if bucket is empty
					if (bucket.isEmpty()) {
						// Bucket is empty, so remove it from the bucket collections
						bucketIndex = searchBuckets(buckets, hash);
						arrayRemoveAt(buckets, bucketIndex);
						delete bucketsByHash[hash];
					}
				}
			}
			return oldValue;
		};

		this.size = function() {
			var total = 0, i = buckets.length;
			while (i--) {
				total += buckets[i].entries.length;
			}
			return total;
		};
	}

    Hashtable.prototype = {
        each: function(callback) {
            var entries = this.entries(), i = entries.length, entry;
            while (i--) {
                entry = entries[i];
                callback(entry[0], entry[1]);
            }
        },

        equals: function(hashtable) {
            var keys, key, val, count = this.size();
            if (count == hashtable.size()) {
                keys = this.keys();
                while (count--) {
                    key = keys[count];
                    val = hashtable.get(key);
                    if (val === null || val !== this.get(key)) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        },

        putAll: function(hashtable, conflictCallback) {
			var entries = hashtable.entries();
			var entry, key, value, thisValue, i = entries.length;
			var hasConflictCallback = (typeof conflictCallback == FUNCTION);
			while (i--) {
				entry = entries[i];
				key = entry[0];
				value = entry[1];

				// Check for a conflict. The default behaviour is to overwrite the value for an existing key
				if ( hasConflictCallback && (thisValue = this.get(key)) ) {
					value = conflictCallback(key, thisValue, value);
				}
				this.put(key, value);
			}
		},

        clone: function() {
			var clone = new Hashtable(this.properties);
			clone.putAll(this);
			return clone;
		}
    };

    if (typeof encodeURIComponent != UNDEF) {
        Hashtable.prototype.toQueryString = function() {
            var entries = this.entries(), i = entries.length, entry;
            var parts = [];
            while (i--) {
                entry = entries[i];
                parts[i] = encodeURIComponent( toStr(entry[0]) ) + "=" + encodeURIComponent( toStr(entry[1]) );
            }
            return parts.join("&");
        };
    }

    Hashtable.fromObject = function(obj) {
        var hashTable = new Hashtable({
            hashingFunction: toStr,
            useKeyEqualsMethod: false
        });
        var val, hasOwnPropertyExists = (typeof obj.hasOwnProperty != UNDEF);
        for (var k in obj) {
            if ((!hasOwnPropertyExists || obj.hasOwnProperty(k))) {
                val = obj[k];
                if (typeof val != UNDEF && val !== null) {
                    hashTable.put(k, val);
                }
            }
        }
        return hashTable;
    };

	return Hashtable;
})();