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

	s.test("boolean key test 1", function(t) {
		var h = new Hashtable();
		h.put(true, "Test 1");
		t.assertEquals("Test 1", h.get(true));
	});

	s.test("boolean key test 2", function(t) {
		var h = new Hashtable();
		h.put(true, "Test 1");
		h.put(true, "Test 2");
		t.assertEquals(1, h.size());
		t.assertEquals("Test 2", h.get(true));
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
	
	s.test("Hash and equality function test", function(t) {
		var o1 = new TestObject("one");
		var o2 = new TestObject("two");
		var o3 = new TestObject("three");
		
		function hashToConstant(obj) {
			return "A constant hash";
		}

		function nameSameLength(o1, o2) {
			return o1.name.length === o2.name.length;
		}

		var h = new Hashtable(hashToConstant, nameSameLength);
		h.put(o1, 1);
		h.put(o2, 2);
		h.put(o3, 3);
		
		t.assertEquals(2, h.size());
		t.assertEquals(2, h.get(o1));
		t.assertEquals(2, h.get(o2));
		t.assertEquals(3, h.get(o3));
	});
	
	s.test("Docs example 1", function(t) {
		var h = new Hashtable();
		h.put("Dave", "human");
		
		var fido = { name: "Fido" };
		h.put(fido, "dog");
		
		t.assertEquals("dog", h.get(fido) );
	});

	s.test("Docs example 2", function(t) {
		var key = new Object();
		var o = new Object();
		o[key] = "First";
		t.assertEquals("First", o[key] );
	});

	s.test("Docs example 3", function(t) {
		var key1 = new Object();
		var key2 = new Object();
		var o = new Object();
		o[key1] = "First";
		o[key2] = "Second";
		t.assertEquals("Second", o[key1] );
	});

	s.test("Docs example 4", function(t) {
		var key1 = new Object();
		var key2 = new Object();
		var h = new Hashtable();
		h.put(key1, "First");
		h.put(key2, "Second");
		t.assertEquals("First", h.get(key1) );
		t.assertEquals("Second", h.get(key2) );
	});

	s.test("Docs example 5", function(t) {
		function Point(x, y) {
		    this.x = x;
		    this.y = y;
		}
		
		var coloursForPoints = new Hashtable();
		
		coloursForPoints.put( new Point(1, 2), "green" );
		
		function getColourAt(x, y) {
		    var point = new Point(x, y);
		    return coloursForPoints.get(point);
		}
		
		t.assertEquals(null, getColourAt(1, 2) );
	});

	s.test("Docs example 6", function(t) {
		function Point(x, y) {
		    this.x = x;
		    this.y = y;
		}
		
		Point.prototype.equals = function(obj) {
		    return (obj instanceof Point) &&
		        (obj.x === this.x) &&
		        (obj.y === this.y);
		};
		
		var coloursForPoints = new Hashtable();
		
		coloursForPoints.put( new Point(1, 2), "green" );
		
		function getColourAt(x, y) {
		    var point = new Point(x, y);
		    return coloursForPoints.get(point);
		}
		
		t.assertEquals( "green", getColourAt(1, 2) );
	});

	s.test("Docs example 7", function(t) {
		function Point(x, y) {
		    this.x = x;
		    this.y = y;
		}
		
		Point.prototype.equals = function(obj) {
		    return (obj instanceof Point) &&
		        (obj.x === this.x) &&
		        (obj.y === this.y);
		};
		
		Point.prototype.hashCode = function(obj) {
		    return "Point:" + this.x + "," + this.y;
		};

		var coloursForPoints = new Hashtable();
		
		coloursForPoints.put( new Point(1, 2), "green" );
		
		function getColourAt(x, y) {
		    var point = new Point(x, y);
		    return coloursForPoints.get(point);
		}
		
		t.assertEquals( "green", getColourAt(1, 2) );
	});

});
