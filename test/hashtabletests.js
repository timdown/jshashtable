xn.test.enableTestDebug = true;
xn.test.suite("JavaScript Hashtable test suite", function(s) {
	s.test("Simple put/get test", function(t) {
		var h = new Hashtable();
		var o = {};
		h.put(o, "A value");
		t.assertEquals("A value", h.get(o));
	});

	s.test("Distinguishing between keys test", function(t) {
		var h = new Hashtable();
		var o1 = {};
		var o2 = {};
		h.put(o1, "First");
		h.put(o2, "Second");
		t.assertEquals("First", h.get(o1));
		t.assertEquals("Second", h.get(o2));
	});
	
	s.test("Initial size test", function(t) {
		var h = new Hashtable();
		t.assertEquals(0, h.size());
	});
	
	s.test("Removal size test", function(t) {
		var h = new Hashtable();
		var o = {};
		h.put(o, "Test");
		h.remove(o);
		t.assertEquals(0, h.size());
	});

	s.test("Removal get test", function(t) {
		var h = new Hashtable();
		var o = {};
		h.put(o, "Test");
		h.remove(o);
		t.assertEquals(null, h.get(o));
	});

	s.test("Replace test", function(t) {
		var h = new Hashtable();
		var o = {};
		h.put(o, "Test 1");
		h.put(o, "Test 2");
		t.assertEquals("Test 2", h.get(o));
	});

	s.test("Replace size test", function(t) {
		var h = new Hashtable();
		var o = {};
		h.put(o, "Test 1");
		h.put(o, "Test 2");
		t.assertEquals(1, h.size());
	});

	s.test("Contains key test on empty", function(t) {
		var h = new Hashtable();
		t.assertFalse(h.containsKey("test"));
	});

	s.test("Contains key positive test", function(t) {
		var h = new Hashtable();
		var o = {};
		h.put(o, "Test 1");
		t.assertTrue(h.containsKey(o));
	});

	s.test("Contains key negative test", function(t) {
		var h = new Hashtable();
		var o1 = {};
		var o2 = {};
		h.put(o1, "Test 1");
		t.assertFalse(h.containsKey(o2));
	});

	s.test("Contains value test on empty", function(t) {
		var h = new Hashtable();
		t.assertFalse(h.containsValue("test"));
	});

	s.test("Contains value positive test", function(t) {
		var h = new Hashtable();
		var o = {};
		h.put(o, "Test 1");
		t.assertTrue(h.containsValue("Test 1"));
	});

	s.test("Contains value negative test", function(t) {
		var h = new Hashtable();
		var o = {};
		h.put(o, "Test 1");
		t.assertFalse(h.containsValue("Test 2"));
	});

	s.test("Empty string key test", function(t) {
		var h = new Hashtable();
		h.put("", "Test 1");
		t.assertEquals("Test 1", h.get(""));
	});

	s.test("null key test", function(t) {
		var h = new Hashtable();
		t.assertError(
			function() {
				h.put(null, "Test 1");
			}
		);
	});

	s.test("undefined key test", function(t) {
		var h = new Hashtable();
		t.assertError(
			function() {
				h.put(undefined, "Test 1");
			}
		);
	});

	s.test("null value test", function(t) {
		var h = new Hashtable();
		t.assertError(
			function() {
				h.put("test", null);
			}
		);
	});

	s.test("undefined value test", function(t) {
		var h = new Hashtable();
		t.assertError(
			function() {
				h.put("test", undefined);
			}
		);
	});
	
	function TestObject(name) {
		this.name = name;
	}
	
	TestObject.prototype = {
		getHashCode: function() {
			return this.name;
		},
		
		equals: function(obj) {
			return this.name === obj.name;
		}
	}
	
	s.test("getHashCode test 1", function(t) {
		var o1 = new TestObject("one");
		var o2 = new TestObject("two");

		var h = new Hashtable();
		h.put(o1, 1);
		h.put(o2, 2);
		
		t.assertEquals(2, h.size());
		t.assertEquals(1, h.get(o1));
		t.assertEquals(2, h.get(o2));
	});

	s.test("getHashCode test 2", function(t) {
		var o1 = new TestObject("one");
		var o2 = new TestObject("one");

		var h = new Hashtable();
		h.put(o1, 1);
		h.put(o2, 2);
		
		t.assertEquals(1, h.size());
		t.assertEquals(2, h.get(o1));
		t.assertEquals(2, h.get(o2));
	});

	function TestObject2(name) {
		this.name = name;
	}
	
	TestObject2.prototype = {
		getHashCode: function() {
			return this.name;
		},
		
		equals: function(obj) {
			return this === obj;
		}
	}

	s.test("equals test", function(t) {
		var o1 = new TestObject2("one");
		var o2 = new TestObject2("one");

		var h = new Hashtable();
		h.put(o1, 1);
		h.put(o2, 2);
		
		t.assertEquals(2, h.size());
		t.assertEquals(1, h.get(o1));
		t.assertEquals(2, h.get(o2));
	});
	
	s.test("keys test", function(t) {
		var o1 = new TestObject("one");
		var o2 = new TestObject("two");

		var h = new Hashtable();
		h.put(o1, 1);
		h.put(o2, 2);
		
		var keys = h.keys();
		
		t.assertEquals(2, keys.length);
		t.assertTrue((keys[0] === o1 && keys[1] === o2) || (keys[0] === o2 && keys[1] === o1));
	});
	
	s.test("values test", function(t) {
		var o1 = new TestObject("one");
		var o2 = new TestObject("two");

		var h = new Hashtable();
		h.put(o1, 1);
		h.put(o2, 2);
		
		var values = h.values();
		
		t.assertEquals(2, values.length);
		t.assertTrue((values[0] === 1 && values[1] === 2) || (values[0] === 2 && values[1] === 1));
	});

	s.test("benchmark - no getHashCode and equals", function(t) {
		var h = new Hashtable();
		var objects = [];

		// Create lots of normal objects and put them in the hash table
		for (var i = 0; i < 500; i++) {
			objects[i] = { name: "name_" + i };
			h.put(objects[i], i);
		}
		
		// Retrieve a random object lots of time
		var len = objects.length;
		for (i = 0; i < 50; i++) {
			h.get(objects[Math.floor(Math.random() * len)]);
		}
	});

	s.test("benchmark - with getHashCode and equals", function(t) {
		var h = new Hashtable();
		var objects = [];

		// Create lots of normal objects and put them in the hash table
		for (var i = 0; i < 500; i++) {
			objects[i] = new TestObject("name_" + i);
			h.put(objects[i], i);
		}
		
		// Retrieve a random object lots of time
		var len = objects.length;
		for (i = 0; i < 50; i++) {
			h.get(objects[Math.floor(Math.random() * len)]);
		}
	});

/*
	var o = {};
	var propNames = [];
	var a = [];
	for (var i = 0; i < 200000; i++) {
		propNames[i] = "p" + i;
		o[propNames[i]] = i;
		a[i] = i;
	}


	s.test("Objects", function(t) {
		var dummy, prop;
		for (var i = 0, len = propNames.length; i < len; i++) {
			prop = propNames[i];
			dummy = o[prop];
		}
	});

	s.test("Arrays", function(t) {
		var dummy, prop;
		for (var i = 0, len = propNames.length; i < len; i++) {
			prop = propNames[i];
			dummy = a[i];
		}
	});
*/
});
