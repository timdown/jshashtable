# HashSet #

HashSet is similar to HashSet implementations found in [Java](http://download.oracle.com/javase/6/docs/api/java/util/HashSet.html) and [C#](http://msdn.microsoft.com/en-us/library/bb359438.aspx). It wraps the keys of a jshashtable hash table.

## Using HashSet ##

HashSet depends on jshashtable's `HashTable` implementation. You will therefore need to include both jshashtable.js and jshashset.js, in that order.

## Constructor ##


---


### `HashSet([Function hashingFunction[, Function equalityFunction]])` ###

Creates a new HashSet.

#### Parameters ####

  * `hashingFunction`<br>An optional function that provides hash codes for keys placed in the wrapped hash table. It is passed the object to be hashed as its only parameter. If not provided, the hash table checks whether the object has a <code>hashCode()</code> method, and if not, calls <code>toString()</code> on the object.<br>
<ul><li><code>equalityFunction</code><br>An optional function that checks for equality between two keys with the same hash code. Two keys that are considered equal will map to the same value in the hash table. This function is passed the two objects to be compared as its parameters. If not provided, the wrapped hash table checks whether either object being compared has an <code>equals()</code> method, and if not, compares the objects using the <code>===</code> operator.</li></ul>

<hr />

<h2>Methods</h2>

<hr />

<h3><code>void add(mixed value)</code></h3>

Adds the specified object or primitive to the set. <code>value</code> replaces any member of the set equal to it.<br>
<br>
<hr />

<h3><code>void addAll(Array arr)</code></h3>

Adds all members of an array <code>arr</code> to the set in descending order. Each member of <code>arr</code> replaces any member of the set equal to it. Since the order is descending, this means that an earlier member overwrites an equal later member of the array within the set.<br>
<br>
<hr />

<h3><code>Array values()</code></h3>

Returns an array containing all the members of the set in unspecified order.<br>
<br>
<hr />

<h3><code>void remove(mixed value)</code></h3>

Removes the specified value from the set.<br>
<br>
<hr />

<h3><code>Boolean contains(mixed value)</code></h3>

Returns whether the set contains the specified value.<br>
<br>
<hr />

<h3><code>void clear()</code></h3>

Removes all members from the set.<br>
<br>
<hr />

<h3><code>Number size()</code></h3>

Returns the number of members contained in the set.<br>
<br>
<hr />

<h3><code>Boolean isEmpty()</code></h3>

Returns <code>true</code> if the set has no members, <code>false</code> otherwise.<br>
<br>
<hr />

<h3><code>Boolean isSubsetOf(HashSet otherSet)</code></h3>

Returns <code>true</code> if every member this set is also a member of <code>otherSet</code>.<br>
<br>
<hr />

<h3><code>HashSet clone()</code></h3>

Creates and returns a shallow copy of the set. If hashing and equality functions were provided to the set when it was constructed, they are passed into the new set.<br>
<br>
<hr />

<h3><code>HashSet intersection(HashSet otherSet)</code></h3>

Creates and returns a new <code>HashSet</code> containing those elements that are contained in both this set and <code>otherSet</code>.<br>
<br>
<hr />

<h3><code>HashSet union(HashSet otherSet)</code></h3>

Creates and returns a new <code>HashSet</code> containing those elements that are contained in one or both of this set and <code>otherSet</code>.<br>
<br>
<hr />

<h3><code>HashSet complement(HashSet otherSet)</code></h3>

Creates and returns a new <code>HashSet</code> containing those elements that are contained in this set but not <code>otherSet</code>.<br>
<br>
<hr />