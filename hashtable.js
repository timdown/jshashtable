var Hashtable = (function() {
	function hasMethod(obj, methodName) {
		return (typeof obj[methodName] === "function");
	}
	
	function isUndefined(obj) {
		return (typeof obj === "undefined");
	}

	function hasEquals(obj) {
		return hasMethod(obj, "equals");
	}

	function hasGetHashCode(obj) {
		return hasMethod(obj, "getHashCode");
	}
	
	function keyForObject(obj) {
		if (hasGetHashCode(obj)) {
			// Check the getHashCode method really has returned a string
			var hashCode = obj.getHashCode();
			if (typeof hashCode !== "string") {
				return keyForObject(hashCode);
			}
			return hashCode;
		} else if (hasMethod(obj, "toString")) {
			return obj.toString();
		} else {
			return String(obj);
		}
	}
	
	function areEqual(obj1, obj2) {
		if (hasEquals(obj1)) {
			return obj1.equals(obj2);
		} else if (hasEquals(obj2)) {
			return obj2.equals(obj1);
		} else {
			return obj1 === obj2;
		}
	}
	
	function arraySearch(arr, value, arrayValueFunction, returnFoundItem) {
		var valueHasEquals = hasEquals(value);
		var comparisonValue;
		for (var i = 0, len = arr.length; i < len; i++) {
			comparisonValue = arrayValueFunction(arr[i]);
			// This is a small optimization to prevent areEqual doing unnecessary checks
			// for an equals method on value
			if ((valueHasEquals && areEqual(value, comparisonValue)) || (!valueHasEquals && areEqual(comparisonValue, value))) {
				return returnFoundItem ? [i, arr[i]] : true;
			}
		}
		return false;
	}
	
	function arrayRemoveAt(arr, idx) {
		if (hasMethod(arr, "splice")) {
			arr.splice(idx, 1);
		} else {
			if (idx === arr.length - 1) {
				arr.length = idx;
			} else {
				var itemsAfterDeleted = arr.slice(idx + 1);
				arr.length = idx;
				for (var i = 0, len = itemsAfterDeleted.length; i < len; i++) {
					arr[idx + i] = itemsAfterDeleted[i];
				}
			}
		}
	}
	
	function checkKeyOrValue(kv, kvStr) {
		if (kv === null) {
			throw new Error("null is not a valid " + kvStr);
		} else if (isUndefined(kv)) {
			throw new Error(kvStr + " must not be undefined");
		}
	}
	
	var keyStr = "key", valueStr = "value";	
	
	function checkKey(key) {
		checkKeyOrValue(key, keyStr);
	}

	function checkValue(value) {
		checkKeyOrValue(value, valueStr);
	}

	/*------------------------------------------------------------------------*/	
	
	function Bucket(firstKey, firstValue) {
		this.entries = [];
		this.addEntry(firstKey, firstValue);
	}
	
	Bucket.prototype = {
		getBucketEntryKey: function(entry) {
			return entry[0];
		},

		getBucketEntryValue: function(entry) {
			return entry[1];
		},

		searchForEntry: function(key) {
			return arraySearch(this.entries, key, this.getBucketEntryKey, true);
		},

		getEntryForKey: function(key) {
			return this.searchForEntry(key)[1];
		},

		getEntryIndexForKey: function(key) {
			return this.searchForEntry(key)[0];
		},
		
		removeEntryForKey: function(key) {
			var result = this.searchForEntry(key);
			if (result) {
				arrayRemoveAt(this.entries, result[0]);
				return true;
			}
			return false;
		},

		addEntry: function(key, value) {
			this.entries[this.entries.length] = [key, value];
		},
		
		size: function() {
			return this.entries.length;
		},
		
		keys: function(keys) {
			var startIndex = keys.length;
			for (var i = 0, len = this.entries.length; i < len; i++) {
				keys[startIndex + i] = this.entries[i][0];
			}
		},
		
		values: function(values) {
			var startIndex = values.length;
			for (var i = 0, len = this.entries.length; i < len; i++) {
				values[startIndex + i] = this.entries[i][1];
			}
		},
		
		containsKey: function(key) {
			return arraySearch(this.entries, key, this.getBucketEntryKey, false);
		},
		
		containsValue: function(value) {
			return arraySearch(this.entries, value, this.getBucketEntryValue, false);
		}
	};
	
	/*------------------------------------------------------------------------*/	

	// Supporting functions for searching hashtable bucket items
	
	function getBucketKeyFromBucketItem(bucketItem) {
		return bucketItem[0];
	}
	
	function searchBucketItems(bucketItems, bucketKey) {
		return arraySearch(bucketItems, bucketKey, getBucketKeyFromBucketItem, true);
	}
	
	var isBucketItem;
	if (Object.prototype.hasOwnProperty) {
		isBucketItem = function(bucketItemsByBucketKey, bucketKey, bucketItem) {
			return bucketItemsByBucketKey.hasOwnProperty(bucketKey);
		};
	} else {
		isBucketItem = function(bucketItemsByBucketKey, bucketKey, bucketItem) {
			if (!bucketItem) {
				return false;
			}
			var firstInBucketItem = bucketItem[0];
			return Boolean(!isUndefined(firstInBucketItem) && (firstInBucketItem === bucketKey));
		};
	}
	
	function getBucketForBucketKey(bucketItemsByBucketKey, bucketKey) {
		var bucketItem = bucketItemsByBucketKey[bucketKey];

		// Check that this is a genuine bucket item and not something
		// inherited from prototype
		if (bucketItem && isBucketItem(bucketItemsByBucketKey, bucketKey, bucketItem)) {
			return bucketItem[1];
		}
		return null;
	}
	
	/*------------------------------------------------------------------------*/	
	
	function Hashtable(useGetHashCode) {
		var keys = [];
		var bucketItems = [];
		var bucketItemsByBucketKey = {};
		var values = [];
		
		var hashtable = this;
	
		this.put = function(key, value) {
			checkKey(key);
			checkValue(value);

			var bucketKey = keyForObject(key);

			// Check if a bucket exists for the bucket key
			var bucket = getBucketForBucketKey(bucketItemsByBucketKey, bucketKey);
			if (bucket) {
				// Check this bucket to see if it already contains this key
				var bucketEntry = bucket.getEntryForKey(key);
				if (bucketEntry) {
					// This bucket entry is the current mapping of key to value, so replace
					// old value and we're done.
					bucketEntry[1] = value;
				} else {
					// The bucket does not contain an entry for this key, so add one
					bucket.addEntry(key, value);
				}
			} else {
				// No bucket, so create one and put our key/value mapping in
				var bucketItem = [bucketKey, new Bucket(key, value)];
				bucketItems[bucketItems.length] = bucketItem;
				bucketItemsByBucketKey[bucketKey] = bucketItem;
			}
		};
		
		this.get = function(key) {
			checkKey(key);

			var bucketKey = keyForObject(key);

			// Check if a bucket exists for the bucket key
			var bucket = getBucketForBucketKey(bucketItemsByBucketKey, bucketKey);
			if (bucket) {
				// Check this bucket to see if it contains this key
				var bucketEntry = bucket.getEntryForKey(key);
				if (bucketEntry) {
					// This bucket entry is the current mapping of key to value, so return
					// the value.
					return bucketEntry[1];
				}
			}
			return null;
		};

		this.containsKey = function(key) {
			checkKey(key);

			var bucketKey = keyForObject(key);

			// Check if a bucket exists for the bucket key
			var bucket = getBucketForBucketKey(bucketItemsByBucketKey, bucketKey);
			if (bucket) {
				return bucket.containsKey(key);
			}
			
			return false;
		};
		
		this.containsValue = function(value) {
			checkValue(value);
			for (var i = 0, len = bucketItems.length; i < len; i++) {
				if (bucketItems[i][1].containsValue(value)) {
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
			return bucketItems.length === 0;
		};
		
		this.keys = function() {
			var keys = [];
			for (var i = 0, len = bucketItems.length; i < len; i++) {
				bucketItems[i][1].keys(keys);
			}
			return keys;
		};
		
		this.values = function() {
			var values = [];
			for (var i = 0, len = bucketItems.length; i < len; i++) {
				bucketItems[i][1].values(values);
			}
			return values;
		};
		
		this.remove = function(key) {
			checkKey(key);

			var bucketKey = keyForObject(key);

			// Check if a bucket exists for the bucket key
			var bucket = getBucketForBucketKey(bucketItemsByBucketKey, bucketKey);

			if (bucket) {
				// Remove entry from this bucket for this key
				if (bucket.removeEntryForKey(key)) {
					// Entry was removed, so check if bucket is empty
					if (bucket.size() === 0) {
						// Bucket is empty, so remove it
						var result = searchBucketItems(bucketItems, bucketKey);
						arrayRemoveAt(bucketItems, result[0]);
						delete bucketItemsByBucketKey[bucketKey];
					}
				}
			}
		};

		this.size = function() {
			var total = 0;
			for (var i = 0, len = bucketItems.length; i < len; i++) {
				total += bucketItems[i][1].size();
			}
			return total;
		};
	}

	return Hashtable;
})();