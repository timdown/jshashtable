xn.test.enableTestDebug = true;
xn.test.suite("JavaScript Hashtable benchmark test suite", function(s) {

	function NamedObjectWithHashCode(name) {
		this.name = name;
	}

	NamedObjectWithHashCode.prototype = {
		hashCode: function() {
			return this.name;
		},

		equals: function(obj) {
			return this.name === obj.name;
		}
	};

	function NamedObject(name) {
		this.name = name;
	}

	NamedObject.prototype = {};


	function TestObject2(name) {
		this.name = name;
	}

	TestObject2.prototype = {
		hashCode: function() {
			return this.name;
		},

		equals: function(obj) {
			return this === obj;
		}
	};

	s.test("Proof of toString in JavaScript object property names", function(t) {
		var key = {
			toString: function() {
				return "Three bean stew";
			}
		};

		var o = {
			"Three bean stew": 0
		};
		o[key] = 1;
		t.assertEquals(1, o["Three bean stew"]);
	});

	s.test("Numeric test", function(t) {
		var o = {};
		o[1.3] = 1;
		t.assertEquals(1, o[1.3]);
	});

	function testSpeed(initialPuts, gets, replacePuts) {
		var keySameHashCode = [], keyDifferentHashCodes = [];
		var hSameHashCode = new Hashtable(), hDifferentHashCodes = new Hashtable();

		s.test("Putting " + initialPuts + " objects with same hash code into Hashtable", function() {
			// Create lots of normal objects and put them in the hash table
			for (var i = 0; i < initialPuts; i++) {
				keySameHashCode[i] = new NamedObject("name_" + i);
				hSameHashCode.put(keySameHashCode[i], i);
			}
		});

		s.test("Putting " + initialPuts + " objects with different hash code into Hashtable", function() {
			// Create lots of normal objects and put them in the hash table
			for (var i = 0; i < initialPuts; i++) {
				keyDifferentHashCodes[i] = new NamedObjectWithHashCode("name_" + i);
				hDifferentHashCodes.put(keyDifferentHashCodes[i], i);
			}
		});

		function getRandomKeyIndex() {
			return Math.floor(Math.random() * initialPuts);
		}

		s.test("Retrieving " + gets + " objects with same hash code from Hashtable", function() {
			// Retrieve objects added at random from the hash table
			for (var i = 0; i < gets; i++) {
				hSameHashCode.get(keySameHashCode[getRandomKeyIndex()]);
			}
		});

		s.test("Retrieving " + gets + " objects with different hash code from Hashtable", function() {
			// Retrieve objects added at random from the hash table
			for (var i = 0; i < gets; i++) {
				hDifferentHashCodes.get(keyDifferentHashCodes[getRandomKeyIndex()]);
			}
		});

		var randomKeysSame = [];
		var randomKeysDifferent = [];
		var keyIndex;

		s.test("Set-up", function() {
			for (var i = 0; i < replacePuts; i++) {
				keyIndex = getRandomKeyIndex();
				//console.log("keyIndex: " + keyIndex, keySameHashCode);
				randomKeysSame[i] = keySameHashCode[keyIndex];
				randomKeysDifferent[i] = keyDifferentHashCodes[keyIndex];
			}
		});

		s.test("Replacing " + replacePuts + " objects with same hash code in Hashtable", function() {
			// Retrieve objects added at random in the hash table
			for (var i = 0; i < replacePuts; i++) {
				hSameHashCode.put(randomKeysSame[i], i);
			}
		});

		s.test("Replacing " + replacePuts + " objects with different hash code in Hashtable", function() {
			// Retrieve objects added at random in the hash table
			for (var i = 0; i < replacePuts; i++) {
				hDifferentHashCodes.put(randomKeysDifferent[i], i);
			}
		});

        s.test("Removing " + replacePuts + " objects", function() {
            // Remove all objects one by one from the hash table
            for (var i = 0; i < replacePuts; i++) {
                hSameHashCode.remove(randomKeysSame[i]);
            }
        });

        s.test("Removing " + replacePuts + " objects", function() {
            // Remove all objects one by one from the hash table
            for (var i = 0; i < replacePuts; i++) {
                hDifferentHashCodes.remove(randomKeysDifferent[i]);
            }
        });

        s.test("Tear down", function() {
            hSameHashCode.clear();
            hDifferentHashCodes.clear();
            randomKeysSame = randomKeysDifferent = null;
        });
	}

	testSpeed(100, 200, 500);
	testSpeed(1000, 500, 1000);

    function testSimpleSpeed(initialPuts, gets, replacePuts) {
        var hSimple = new Hashtable( {useKeyEqualsMethod: false} ), hNonSimple = new Hashtable();
        var simpleKeys = [], nonSimpleKeys = [];

        s.test("Putting " + initialPuts + " objects with same hash code into simple Hashtable", function() {
            // Create lots of normal objects and put them in the hash table
            for (var i = 0, key; i < initialPuts; i++) {
                key = {};
                hSimple.put(key, i);
                simpleKeys.push(key)
            }
        });

        s.test("Putting " + initialPuts + " objects with same hash code into non-simple Hashtable", function() {
            // Create lots of normal objects and put them in the hash table
            for (var i = 0, key; i < initialPuts; i++) {
                key = {};
                hNonSimple.put(key, i);
                nonSimpleKeys.push(key)
            }
        });

        function getRandomKeyIndex() {
            return Math.floor(Math.random() * initialPuts);
        }

        s.test("Retrieving " + gets + " objects with same hash code from simple Hashtable", function() {
            // Retrieve objects added at random from the hash table
            for (var i = 0; i < gets; i++) {
                hSimple.get(simpleKeys[getRandomKeyIndex()]);
            }
        });

        s.test("Retrieving " + gets + " objects with same hash code from non-simple Hashtable", function() {
            // Retrieve objects added at random from the hash table
            for (var i = 0; i < gets; i++) {
                hNonSimple.get(nonSimpleKeys[getRandomKeyIndex()]);
            }
        });

        var randomKeysSimple = [];
        var randomKeysNonSimple = [];
        var keyIndex;

        s.test("Set-up", function() {
            for (var i = 0; i < replacePuts; i++) {
                keyIndex = getRandomKeyIndex();
                //console.log("keyIndex: " + keyIndex, keySameHashCode);
                randomKeysSimple[i] = simpleKeys[keyIndex];
                randomKeysNonSimple[i] = nonSimpleKeys[keyIndex];
            }
        });


        s.test("Replacing " + replacePuts + " objects in simple Hashtable", function() {
            // Retrieve objects added at random in the hash table
            for (var i = 0; i < replacePuts; i++) {
                hSimple.put(randomKeysSimple[i], i);
            }
        });

        s.test("Replacing " + replacePuts + " objects in non-simple Hashtable", function() {
            // Retrieve objects added at random in the hash table
            for (var i = 0; i < replacePuts; i++) {
                hNonSimple.put(randomKeysNonSimple[i], i);
            }
        });

        s.test("Removing " + replacePuts + " objects in simple Hashtable", function() {
            // Remove all objects one by one from the hash table
            for (var i = 0; i < replacePuts; i++) {
                hSimple.remove(randomKeysSimple[i]);
            }
        });

        s.test("Removing " + replacePuts + " objects in non-simple Hashtable", function() {
            // Remove all objects one by one from the hash table
            for (var i = 0; i < replacePuts; i++) {
                hNonSimple.remove(randomKeysNonSimple[i]);
            }
        });

        s.test("Tear down", function() {
            hSimple.clear();
            hNonSimple.clear();
            randomKeysSimple = randomKeysNonSimple = null;
        });
    }

    testSimpleSpeed(1000, 2000, 5000);



});
