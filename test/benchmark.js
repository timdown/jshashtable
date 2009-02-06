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
	}
	
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
		var keySameHashCode, keyDifferentHashCodes;
		var hSameHashCode, hDifferentHashCodes;
	
		s.test("Putting " + initialPuts + " objects with same hash code into Hashtable", function(t) {
			hSameHashCode = new Hashtable();
			keySameHashCode = [];
	
			// Create lots of normal objects and put them in the hash table
			for (var i = 0; i < initialPuts; i++) {
				keySameHashCode[i] = new NamedObject("name_" + i);
				hSameHashCode.put(keySameHashCode[i], i);
			}
		});
	
		s.test("Putting " + initialPuts + " objects with different hash code into Hashtable", function(t) {
			hDifferentHashCodes = new Hashtable();
			keyDifferentHashCodes = [];
	
			// Create lots of normal objects and put them in the hash table
			for (var i = 0; i < initialPuts; i++) {
				keyDifferentHashCodes[i] = new NamedObjectWithHashCode("name_" + i);
				hDifferentHashCodes.put(keyDifferentHashCodes[i], i);
			}
		});
		
		function getRandomKeyIndex() {
			return Math.floor(Math.random() * initialPuts);
		}
	
		s.test("Retrieving " + gets + " objects with same hash code from Hashtable", function(t) {
			// Retrieve objects added at random from the hash table
			for (var i = 0; i < gets; i++) {
				hSameHashCode.get(keySameHashCode[getRandomKeyIndex()], i);
			}
		});
	
		s.test("Retrieving " + gets + " objects with different hash code from Hashtable", function(t) {
			// Retrieve objects added at random from the hash table
			for (var i = 0; i < gets; i++) {
				hDifferentHashCodes.get(keyDifferentHashCodes[getRandomKeyIndex()], i);
			}
		});
		
		var randomKeysSame = [];
		var randomKeysDifferent = [];
		var keyIndex;

		s.test("Set-up", function(t) {
			for (i = 0; i < replacePuts; i++) {
				keyIndex = getRandomKeyIndex();
				//console.log("keyIndex: " + keyIndex, keySameHashCode);
				randomKeysSame[i] = keySameHashCode[keyIndex];
				randomKeysDifferent[i] = keyDifferentHashCodes[keyIndex];
			}
		});

		s.test("Replacing " + replacePuts + " objects with same hash code in Hashtable", function(t) {
			// Retrieve objects added at random in the hash table
			for (var i = 0; i < replacePuts; i++) {
				hSameHashCode.put(randomKeysSame[i], i);
			}
		});

		s.test("Replacing " + replacePuts + " objects with different hash code in Hashtable", function(t) {
			// Retrieve objects added at random in the hash table
			for (var i = 0; i < replacePuts; i++) {
				hDifferentHashCodes.put(randomKeysDifferent[i], i);
			}
		});
	}
	
	testSpeed(100, 200, 500);
	testSpeed(10000, 500, 10000);

});
