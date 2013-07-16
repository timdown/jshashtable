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

    s.test("Removal get first added test", function(t) {
        var h = new Hashtable();
        var o1 = {}, o2 = {};
        h.put(o1, "Test 1");
        h.put(o2, "Test 2");
        h.remove(o1);
        t.assertEquals(1, h.size());
        t.assertEquals(null, h.get(o1));
        t.assertEquals("Test 2", h.get(o2));
    });

    s.test("Removal get last added test", function(t) {
        var h = new Hashtable();
        var o1 = {}, o2 = {};
        h.put(o1, "Test 1");
        h.put(o2, "Test 2");
        var r = h.remove(o2);
        t.assertEquals(1, h.size());
        t.assertEquals(null, h.get(o2));
        t.assertEquals("Test 1", h.get(o1));
        t.assertEquals("Test 2", r);
    });

    s.test("Removal get first added with hashCode test", function(t) {
        var h = new Hashtable();
        var o1 = { hashCode: function() { return 1; } }, o2 = { hashCode: function() { return 2; } };
        h.put(o1, "Test 1");
        h.put(o2, "Test 2");
        h.remove(o1);
        t.assertEquals(1, h.size());
        t.assertEquals(null, h.get(o1));
        t.assertEquals("Test 2", h.get(o2));
    });

    s.test("Removal get last added with hashCode test", function(t) {
        var h = new Hashtable();
        var o1 = { hashCode: function() { return 1; } }, o2 = { hashCode: function() { return 2; } };
        h.put(o1, "Test 1");
        h.put(o2, "Test 2");
        h.remove(o2);
        t.assertEquals(1, h.size());
        t.assertEquals(null, h.get(o2));
        t.assertEquals("Test 1", h.get(o1));
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

    s.test("Replace return value test", function(t) {
        var h = new Hashtable();
        var o = {};
        var v1 = h.put(o, "Test 1");
        var v2 = h.put(o, "Test 2");
        t.assertEquals("Test 2", h.get(o));
        t.assertNull(v1);
        t.assertEquals("Test 1", v2);
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
    };

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
    };

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

        function hashToConstant() {
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

    function areHashTablesEqual(h1, h2) {
        var k1, i, k;
        if (h1.size() == h2.size()) {
            k1 = h1.keys();
            i = k1.length;
            while (i--) {
                k = k1[i];
                if (h1.get(k) !== h2.get(k)) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    s.test("Clone equality test", function(t) {
        var h = new Hashtable(), h2;
        h.put({}, 1);
        h.put(2, "bus");
        h.put("cheese", {});

        h2 = h.clone();
        t.assert(areHashTablesEqual(h, h2))
    });

    s.test("Clone independence test", function(t) {
        var h = new Hashtable(), h2;
        h.put({}, 1);
        h.put(2, "bus");
        h.put("cheese", {});

        h2 = h.clone();

        h.put("new1", 1);
        h2.put("new2", 2);

        t.assert(h2.containsKey("new2"));
        t.assertFalse(h.containsKey("new2"));

        t.assert(h.containsKey("new1"));
        t.assertFalse(h2.containsKey("new1"));
    });

    s.test("Clone hash code generator and equality function test", function(t) {
        var h = new Hashtable(function() { return "always the same"}, function() { return true; }), h2;
        h.put({}, 1);
        h.put(2, "bus");
        h.put("cheese", {});

        t.assertEquals(1, h.size());

        h2 = h.clone();

        h2.put("new", 2);
        t.assertEquals(1, h2.size());

        t.assert(h2.containsKey("new"));
        t.assert(h2.containsKey("anything"));
        t.assertEquals(2, h2.get( {anyOldObject: 1} ));
    });

    s.test("putAll basic test", function(t) {
        var h = new Hashtable(), h2 = new Hashtable();
        var o = {};
        h.put(2, "bus");

        h2.put(o, 3);
        h2.put("test", "yes");

        h.putAll(h2);
        t.assertEquals(h.size(), 3);
        t.assert(h.containsKey(2));
        t.assert(h.containsKey(o));
        t.assert(h.containsKey("test"));
    });

    s.test("putAll default conflict test", function(t) {
        var h = new Hashtable(), h2 = new Hashtable();
        var o = {};
        h.put(2, "bus");
        h.put(o, "h");

        h2.put(o, "h2");
        h2.put("test", "yes");

        h.putAll(h2);
        t.assertEquals(h.size(), 3);
        t.assertEquals(h.get(o), "h2");
    });

    s.test("putAll custom conflict test", function(t) {
        var h = new Hashtable(), h2 = new Hashtable();
        var o = {};
        var collisionResolver = function(key, v1, v2) {
            t.assertEquals(key, o);
            t.assertEquals(v1, "h");
            t.assertEquals(v2, "h2");
            return v1;
        };

        h.put(2, "bus");
        h.put(o, "h");

        h2.put(o, "h2");
        h2.put("test", "yes");

        h.putAll(h2, collisionResolver);
        t.assertEquals(h.size(), 3);
        t.assertEquals(h.get(o), "h");
    });

    s.test("each test", function(t) {
        var h = new Hashtable();
        var o = {};

        h.put(2, "bus");
        h.put(o, "h");

        var eachCount = 0, lastKey = null;

        h.each(function(key, val) {
            eachCount++;
            t.assertEquals(val, h.get(key));
            t.assert(key === o || key ===2);
            t.assert(!lastKey || (key !== lastKey));
        });

        t.assertEquals(eachCount, 2);
    });

    s.test("remove non-existent test", function(t) {
        var h = new Hashtable();
        var r = h.remove("Non-existent");
        t.assertNull(r);
    });

    s.test("remove non-existent test 2", function(t) {
        var h = new Hashtable();
        h.put("test", "thing");
        var r1 = h.remove("test");
        var r2 = h.remove("test");
        t.assertEquals("thing", r1);
        t.assertNull(r2);
    });

    s.test("equals empty test", function(t) {
        var h1 = new Hashtable(), h2 = new Hashtable();
        t.assert(h1.equals(h2));
        t.assert(h2.equals(h1));
    });

    s.test("equals empty and non-empty test", function(t) {
        var h1 = new Hashtable(), h2 = new Hashtable();
        h2.put("Test", 1);
        t.assertFalse(h1.equals(h2));
        t.assertFalse(h2.equals(h1));
    });

    s.test("equals non-empty and non-empty same elements test", function(t) {
        var h1 = new Hashtable(), h2 = new Hashtable();
        h1.put("Test1", 1);
        h1.put("Test2", 1);
        h2.put("Test2", 1);
        h2.put("Test1", 1);
        t.assert(h1.equals(h2));
        t.assert(h2.equals(h1));
    });

    s.test("equals same key, different value test", function(t) {
        var h1 = new Hashtable(), h2 = new Hashtable();
        h1.put("Test", 1);
        h2.put("Test", 2);
        t.assertFalse(h1.equals(h2));
        t.assertFalse(h2.equals(h1));
    });

    s.test("toQueryString", function(t) {
        var h = new Hashtable();
        t.assert(h.toQueryString() == "");
        h.put("Test", "one");
        t.assert(h.toQueryString() == "Test=one");
        h.put("num", 2);
        var query = h.toQueryString();
        t.assert(query == "Test=one&num=2" || query == "num=2&Test=one");
        h.clear();
        h.put("A space", "1/2");
        t.assert(h.toQueryString() == "A%20space=1%2F2");
    });

    if (window && window.ActiveXObject) {
        s.test("ActiveXObject test", function(t) {
            var h = new Hashtable();
            var x1 = new ActiveXObject("Msxml2.XMLHTTP.6.0");
            var x2 = new ActiveXObject("Msxml2.XMLHTTP.6.0");
            h.put(x1, "One");
            h.put(x2, "Two");
            t.assertEquals("One", h.get(x1));
            t.assertEquals("Two", h.get(x2));
        });
    }

    if (window && window.document) {
        s.test("document test", function(t) {
            var h = new Hashtable();
            var doc = window.document;
            doc.expando = false;
            h.put(doc, "One");
            t.assertEquals("One", h.get(doc));
        });

        s.test("document test", function(t) {
            var h = new Hashtable();
            var doc = window.document;
            doc.expando = false;
            var div = doc.createElement("div");
            var textNode = doc.createTextNode("test");
            h.put(div, "One");
            h.put(textNode, "Two");
            t.assertEquals("One", h.get(div));
            t.assertEquals("Two", h.get(textNode));
        });
    }
    
    s.test("Issue 6 (toString issue)", function(t) {
        var hashTable = new Hashtable();
        var xmlStr = '<root><child attrName="attrValue">nodeValue</child></root>';

        var xmlDoc = null;
        if (window['DOMParser']) // Firefox, Chrome, Safari, etc.
        {
            xmlDoc = new DOMParser().parseFromString(xmlStr, 'text/xml');
        }
        else if (window.ActiveXObject) // For IE
        {
            xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
            xmlDoc.async = false;
            xmlDoc.loadXML(xmlStr);
        }

        var key = new Array(xmlDoc);

        // Throws exception in IE 8
        hashTable.put(key, "One");
    });

    s.test("Docs example 1", function(t) {
        var typesHash = new Hashtable();

        typesHash.put("A string", "string");
        typesHash.put(1, "number");

        var o = {};
        typesHash.put(o, "object");

        t.assertEquals("object", typesHash.get(o));
    });

    s.test("Docs example 2", function(t) {
        var key = {};
        var o = {};
        o[key] = "First";
        t.assertEquals("First", o[key] );
    });

    s.test("Docs example 3", function(t) {
        var key1 = {};
        var key2 = {};
        var o = {};
        o[key1] = "First";
        o[key2] = "Second";
        t.assertEquals("Second", o[key1] );
    });

    s.test("Docs example 4", function(t) {
        var key1 = {};
        var key2 = {};
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

        Point.prototype.hashCode = function() {
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

    s.test("Docs example 8", function(t) {
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }

        function hashPoint(p) {
            return "Point:" + p.x + "," + p.y;
        }

        function pointsEqual(p1, p2) {
            return p1.x === p2.x && p1.y === p2.y;
        }

        var coloursForPoints = new Hashtable( { hashCode: hashPoint, equals: pointsEqual } );

        function getColourAt(x, y) {
            var point = new Point(x, y);
            return coloursForPoints.get(point);
        }

        coloursForPoints.put( new Point(1, 2), "green" );

        t.assertEquals( "green", getColourAt(1, 2) );
    });
});
