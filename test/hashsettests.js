xn.test.enableTestDebug = true;
xn.test.suite("JavaScript HashSet test suite", function(s) {
    s.test("Add test", function(t) {
        var s = new HashSet();
        var o = {};
        s.add(o);
        t.assertEquals(1, s.size());
    });

    s.test("isEmpty test", function(t) {
        var s = new HashSet();
        t.assert(s.isEmpty());
        s.add("test");
        t.assertFalse(s.isEmpty());
    });

    s.test("size test", function(t) {
        var s = new HashSet();
        t.assertEquals(0, s.size());
        s.add("test 1");
        t.assertEquals(1, s.size());
        s.add("test 2");
        t.assertEquals(2, s.size());
    });

    s.test("Add two elements test", function(t) {
        var s = new HashSet();
        var o1 = {}, o2 = {};
        s.add(o1);
        s.add(o2);
        t.assertArraysSameElements([o1, o2], s.values());
    });

    s.test("Add repeat elements test", function(t) {
        var s = new HashSet();
        var o1 = {}, o2 = {};
        var o = {};
        s.add(o);
        s.add(o);
        t.assertEquals(1, s.size());
    });

    s.test("Add repeat elements test - force equality check (from issue 5)", function(t) {
        var allHashValuesAreOne = function() {
            return 1;
        };

        var xEqual = function(a, b){
            return a.x == b.x;
        };

        var s = new HashSet(allHashValuesAreOne, xEqual);

        var oneOne = { x: 1, y: "ONE" };
        var oneTwo = { x: 1, y: "TWO" };

        s.add(oneOne);
        s.add(oneTwo);

        t.assertEquals(1, s.size());
        t.assertEquals("TWO", s.values()[0].y);
    });
    
    s.test("Duplicate key replacement enabled (issue 3)", function(t) {
        var s = new HashSet({
            equals: function(a, b) { return a.id === b.id; }
        });
        var o1 = {id: 1, value: "x"}, o2 = {id: 1, value: "y"};
        s.add(o1);
        t.assertEquals("x", s.values()[0].value);
        s.add(o2);   
        t.assertEquals("y", s.values()[0].value);
    });

    s.test("Duplicate key replacement disabled (issue 3)", function(t) {
        var s = new HashSet({
            equals: function(a, b) { return a.id === b.id; },
            replaceDuplicateKey: false
        });
        var o1 = {id: 1, value: "x"}, o2 = {id: 1, value: "y"};
        s.add(o1);
        t.assertEquals("x", s.values()[0].value);
        s.add(o2);
        t.assertEquals("x", s.values()[0].value);
    });

    s.test("addAll test", function(t) {
        var s = new HashSet();
        var o1 = {}, o2 = {};
        var vals = [o1, o2];
        s.addAll(vals);
        t.assertArraysSameElements(vals, s.values());
    });

    s.test("addAll duplicate test", function(t) {
        var s = new HashSet();
        var o1 = {}, o2 = {};
        var vals = [o1, o2];
        s.add(o1);
        s.addAll(vals);
        t.assertArraysSameElements(vals, s.values());
    });

    s.test("addAll equal values, replace enabled test", function(t) {
        var allHashCodesTheSame = function() { return "1"; };
        var allEqual = function() { return true; };

        var s = new HashSet({
            hashCode: allHashCodesTheSame,
            equals: allEqual,
            replaceDuplicateKey: true
        });
        var o1 = {}, o2 = {};
        var vals = [o1, o2];
        s.add(o1);
        s.addAll(vals);
        t.assertEquals(s.size(), 1);
        t.assertEquivalent(s.values()[0], o2);
    });

    s.test("addAll equal values, replace disabled test", function(t) {
        var allHashCodesTheSame = function() { return "1"; };
        var allEqual = function() { return true; };

        var s = new HashSet({
            hashCode: allHashCodesTheSame,
            equals: allEqual,
            replaceDuplicateKey: false
        });
        var o1 = {}, o2 = {};
        var vals = [o1, o2];
        s.add(o1);
        s.addAll(vals);
        t.assertEquals(s.size(), 1);
        t.assertEquivalent(s.values()[0], o1);
    });

    s.test("Removal size test", function(t) {
        var s = new HashSet();
        var o = {};
        s.add(o);
        s.remove(o);
        t.assertEquals(0, s.size());
    });

    s.test("Removal test", function(t) {
        var s = new HashSet();
        var o = {};
        s.add(o);
        s.remove(o);
        t.assertArraysSameElements([], s.values());
    });

    s.test("Remove non-existent test", function(t) {
        var s = new HashSet();
        s.add("test");
        var r1 = s.remove("test");
        var r2 = s.remove("test");
        t.assertEquals("test", r1);
        t.assertNull(r2);
    });

    s.test("Contains test on empty", function(t) {
        var s = new HashSet();
        t.assertFalse(s.contains("test"));
    });

    s.test("Contains positive test", function(t) {
        var s = new HashSet();
        var o = {};
        s.add(o);
        t.assertTrue(s.contains(o));
    });

    s.test("Contains negative test", function(t) {
        var s = new HashSet();
        var o1 = {};
        var o2 = {};
        s.add(o1);
        t.assertFalse(s.contains(o2));
    });

    s.test("null test", function(t) {
        var s = new HashSet();
        t.assertError(
            function() {
                s.add(null);
            }
        );
    });

    s.test("undefined test", function(t) {
        var s = new HashSet();
        t.assertError(
            function() {
                s.add(undefined);
            }
        );
    });

    s.test("Clone equality test", function(t) {
        var s1 = new HashSet(), s2;
        s1.add({});
        s1.add(2);
        s1.add("cheese");

        s2 = s1.clone();
        t.assertArraysSameElements(s1.values(), s2.values());
    });

    s.test("Clone independence test", function(t) {
        var s1 = new HashSet(), s2;
        s1.add({});
        s1.add(2);
        s1.add("cheese");

        s2 = s1.clone();

        s1.add("new1");
        s2.add("new2");

        t.assert(s2.contains("new2"));
        t.assertFalse(s1.contains("new2"));

        t.assert(s1.contains("new1"));
        t.assertFalse(s2.contains("new1"));
    });

    s.test("Intersection test", function(t) {
        var s1 = new HashSet(), s2 = new HashSet();
        var o1 = {}, o2 = {}, o3 = {};

        s1.add(o1);
        s1.add(o2);

        s2.add(o2);
        s2.add(o3);

        var inter1 = s1.intersection(s2);
        var inter2 = s2.intersection(s1);

        t.assertArraysSameElements([o2], inter1.values());
        t.assertArraysSameElements([o2], inter2.values());
    });

    s.test("Empty intersection test", function(t) {
        var s1 = new HashSet(), s2 = new HashSet();
        var o1 = {}, o2 = {}, o3 = {};

        s1.add(o1);
        s1.add(o2);

        s2.add(o3);

        var inter1 = s1.intersection(s2);
        var inter2 = s2.intersection(s1);

        t.assertArraysSameElements([], inter1.values());
        t.assertArraysSameElements([], inter2.values());
    });

    s.test("Union test", function(t) {
        var s1 = new HashSet(), s2 = new HashSet();
        var o1 = {}, o2 = {}, o3 = {};

        s1.add(o1);
        s1.add(o2);

        s2.add(o2);
        s2.add(o3);

        var union1 = s1.union(s2);
        var union2 = s2.union(s1);

        t.assertArraysSameElements([o1, o2, o3], union1.values());
        t.assertArraysSameElements([o1, o2, o3], union2.values());
    });

    s.test("Union empty test", function(t) {
        var s1 = new HashSet(), s2 = new HashSet();

        var union1 = s1.union(s2);
        var union2 = s2.union(s1);

        t.assertArraysSameElements([], union1.values());
        t.assertArraysSameElements([], union2.values());
    });

    s.test("isSubsetOf discrete test", function(t) {
        var s1 = new HashSet(), s2 = new HashSet();
        var o1 = {}, o2 = {};

        s1.add(o1);
        s2.add(o2);

        t.assertFalse(s1.isSubsetOf(s2));
        t.assertFalse(s2.isSubsetOf(s1));
    });

    s.test("isSubsetOf test", function(t) {
        var s1 = new HashSet(), s2 = new HashSet();
        var o1 = {}, o2 = {};

        s1.add(o1);
        s1.add(o2);
        s2.add(o2);

        t.assertTrue(s2.isSubsetOf(s1));
        t.assertFalse(s1.isSubsetOf(s2));
    });

    s.test("isSubsetOf both empty test", function(t) {
        var s1 = new HashSet(), s2 = new HashSet();

        t.assertTrue(s2.isSubsetOf(s1));
        t.assertTrue(s1.isSubsetOf(s2));
    });

    s.test("isSubsetOf both same test", function(t) {
        var s1 = new HashSet(), s2 = new HashSet();
        var o = {};
        s1.add(o);
        s2.add(o);

        t.assertTrue(s2.isSubsetOf(s1));
        t.assertTrue(s1.isSubsetOf(s2));
    });


    s.test("isSubsetOf one empty test", function(t) {
        var s1 = new HashSet(), s2 = new HashSet();
        var o = {};
        s1.add(o);

        t.assertTrue(s2.isSubsetOf(s1));
        t.assertFalse(s1.isSubsetOf(s2));
    });

    s.test("Complement test", function(t) {
        var s1 = new HashSet(), s2 = new HashSet();
        var o1 = {}, o2 = {}, o3 = {};

        s1.add(o1);
        s1.add(o2);
        s1.add(o3);

        s2.add(o2);

        var complement1 = s1.complement(s2);
        var complement2 = s2.complement(s1);

        t.assertArraysSameElements([o1, o3], complement1.values());
        t.assertEquals(0, complement2.values().length);
    });

    s.test("Complement empty test", function(t) {
        var s1 = new HashSet(), s2 = new HashSet();

        var complement1 = s1.complement(s2);
        var complement2 = s2.complement(s1);

        t.assertEquals(0, complement1.values().length);
        t.assertEquals(0, complement2.values().length);
    });
});
