/**
 * Copyright 2009 Tim Down.
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

/**
 * jshashtable
 *
 * jshashtable is a JavaScript implementation of a hash table. It creates a
 * single constructor function called Hashtable in the global scope.
 *
 * Author: Tim Down <tim@timdown.co.uk>
 * Version: 2.0
 * Build date: 20 December 2009
 * Website: http://www.timdown.co.uk/jshashtable
 */

var Hashtable = (function() {
	var UNDEFINED = "undefined",
	    FUNCTION = "function",
	    STRING = "string",
	    NUMBER = "number",
		EQUALS = "equals",
	    HASH_CODE = "hashCode",
	    TO_STRING = "toString";

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

	function keyForObject(obj) {
		var hashCode;
		if (typeof obj == STRING) {
			return obj;
		} else if (typeof obj[HASH_CODE] == FUNCTION) {
			// Check the hashCode method really has returned a string
			hashCode = obj.hashCode();
			return (typeof hashCode == STRING) ? hashCode : keyForObject(hashCode);
		} else if (typeof obj[TO_STRING] == FUNCTION) {
			return obj.toString();
		} else {
			return String(obj);
		}
	}

	function equals_fixedValueHasEquals(fixedValue, variableValue) {
		return fixedValue.equals(variableValue);
	}

	function equals_fixedValueNoEquals(fixedValue, variableValue) {
		return (typeof variableValue[EQUALS] == FUNCTION) ?
			   variableValue.equals(fixedValue) : (fixedValue === variableValue);
	}

	function createKeyValCheck(kvStr) {
		return function(kv) {
			if (kv === null) {
				throw new Error("null is not a valid " + kvStr);
			} else if (typeof kv == UNDEFINED) {
				throw new Error(kvStr + " must not be undefined");
			}
		};
	}

	var checkKey = createKeyValCheck("key"), checkValue = createKeyValCheck("value");

	/*----------------------------------------------------------------------------------------------------------------*/

	function Bucket(firstKey, firstValue, equalityFunction) {
		this.entries = [];
		this.addEntry(firstKey, firstValue);

		if (equalityFunction !== null) {
			this.getEqualityFunction = function() {
				return equalityFunction;
			};
		}
	}

	function createBucketSearcher(returnBool, returnEntryIndex) {
		return function(key) {
			var i = this.entries.length, entry, equals = this.getEqualityFunction(key);
			while (i--) {
				entry = this.entries[i];
				if ( equals(key, entry[0]) ) {
					return returnBool ? true : (returnEntryIndex ? i : entry);
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
			return (typeof searchValue[EQUALS] == FUNCTION) ? equals_fixedValueHasEquals : equals_fixedValueNoEquals;
		},

		getEntryForKey: createBucketSearcher(false, false),

		getEntryIndexForKey: createBucketSearcher(false, true),

		removeEntryForKey: function(key) {
			var result = this.getEntryIndexForKey(key);
			if (typeof result == NUMBER) {
				arrayRemoveAt(this.entries, result[0]);
				return true;
			}
			return false;
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

		containsKey: createBucketSearcher(true, false),

		containsValue: function(value) {
			var i = this.entries.length;
			while (i--) {
				if ( value === this.entries[i][1] ) {
					return true;
				}
			}
			return false;
		}
	};

	/*----------------------------------------------------------------------------------------------------------------*/

	// Define a constructor for objects comprising a bucket with its associated key
	function BucketItem() {}
	BucketItem.prototype = [];

	// Supporting functions for searching hashtable bucket items

	function searchBucketItems(bucketItems, bucketKey) {
		var i = bucketItems.length, bucketItem;
		while (i--) {
			bucketItem = bucketItems[i];
			if ( bucketKey === bucketItem[0] ) {
				return bucketItem;
			}
		}
		return null;
	}

	function getBucketForBucketKey(bucketItemsByBucketKey, bucketKey) {
		var bucketItem = bucketItemsByBucketKey[bucketKey];

		// Check that this is a genuine bucket item and not something
		// inherited from prototype
		return ( bucketItem && (bucketItem instanceof BucketItem) ) ? bucketItem[1] : null;
	}

	/*----------------------------------------------------------------------------------------------------------------*/

	function Hashtable(hashingFunction, equalityFunction) {
		var that = this;
		var bucketItems = [];
		var bucketItemsByBucketKey = {};

		hashingFunction = (typeof hashingFunction == FUNCTION) ? hashingFunction : keyForObject;
		equalityFunction = (typeof equalityFunction == FUNCTION) ? equalityFunction : null;

		this.put = function(key, value) {
			checkKey(key);
			checkValue(value);
			var bucketKey = hashingFunction(key), bucketItem, bucketEntry;

			// Check if a bucket exists for the bucket key
			var bucket = getBucketForBucketKey(bucketItemsByBucketKey, bucketKey);
			if (bucket) {
				// Check this bucket to see if it already contains this key
				bucketEntry = bucket.getEntryForKey(key);
				if (bucketEntry) {
					// This bucket entry is the current mapping of key to value, so replace
					// old value and we're done.
					bucketEntry[1] = value;
				} else {
					// The bucket does not contain an entry for this key, so add one
					bucket.addEntry(key, value);
				}
			} else {
				// No bucket exists for the key, so create one and put our key/value mapping in
				bucketItem = new BucketItem();
				bucketItem[0] = bucketKey;
				bucketItem[1] = new Bucket(key, value, equalityFunction);
				bucketItems[bucketItems.length] = bucketItem;
				bucketItemsByBucketKey[bucketKey] = bucketItem;
			}
		};

		this.get = function(key) {
			checkKey(key);

			var bucketKey = hashingFunction(key);

			// Check if a bucket exists for the bucket key
			var bucket = getBucketForBucketKey(bucketItemsByBucketKey, bucketKey);
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
			var bucket = getBucketForBucketKey(bucketItemsByBucketKey, bucketKey);

			return bucket ? bucket.containsKey(key) : false;
		};

		this.containsValue = function(value) {
			checkValue(value);
			var i = bucketItems.length;
			while (i--) {
				if ( bucketItems[i][1].containsValue(value) ) {
					return true;
				}
			}
			return false;
		};

		this.clear = function() {
			bucketItems.length = 0;
			bucketItemsByBucketKey = {};
		};

		this.isEmpty = function() {
			return !bucketItems.length;
		};

		var createBucketAggregator = function(bucketFuncName) {
			return function() {
				var aggregated = [], i = bucketItems.length;
				while (i--) {
					bucketItems[i][1][bucketFuncName](aggregated);
				}
				return aggregated;
			};
		};

		this.keys = createBucketAggregator("keys");
		this.values = createBucketAggregator("values");
		this.entries = createBucketAggregator("getEntries");

		this.remove = function(key) {
			checkKey(key);

			var bucketKey = hashingFunction(key), result;

			// Check if a bucket exists for the bucket key
			var bucket = getBucketForBucketKey(bucketItemsByBucketKey, bucketKey);

			if (bucket) {
				// Remove entry from this bucket for this key
				if (bucket.removeEntryForKey(key)) {
					// Entry was removed, so check if bucket is empty
					if (!bucket.entries.length) {
						// Bucket is empty, so remove it
						result = searchBucketItems(bucketItems, bucketKey);
						arrayRemoveAt(bucketItems, result[0]);
						bucketItemsByBucketKey[bucketKey] = null;
						delete bucketItemsByBucketKey[bucketKey];
					}
				}
			}
		};

		this.size = function() {
			var total = 0, i = bucketItems.length;
			while (i--) {
				total += bucketItems[i][1].entries.length;
			}
			return total;
		};

		this.each = function(f) {
			var entries = that.entries(), i = entries.length, entry;
			while (i--) {
				entry = entries[i];
				f( entry[0], entry[1] );
			}
		};

		this.putAll = function(hashtable, collisionCallback) {
			var entries = hashtable.entries();
			var entry, key, value, thisValue, i = entries.length;
			var hasCollisionCallback = (typeof collisionCallback == FUNCTION);
			while (i--) {
				entry = entries[i];
				key = entry[0];
				value = entry[1];

				// Check for collision. The default behaviour is to overwrite the value for an existing key
				if ( hasCollisionCallback && (thisValue = that.get(key)) ) {
					value = collisionCallback(key, thisValue, value);
				}
				that.put(key, value);
			}
		};

		this.clone = function() {
			var clone = new Hashtable(hashingFunction, equalityFunction);
			clone.putAll(that);
			return clone;
		};
	}

	return Hashtable;
})();