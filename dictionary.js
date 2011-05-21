/**
 * @license jahashtable, a JavaScript collections library.
 *
 * Dictionary
 *
 * Represents a collection of objects associated with string keys.
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
var Dictionary = (function() {
    function DictionaryValue(value) {
        this.value = value;
    }

    function assertKeyValid(key, methodName) {
        if (typeof key == "string") {
            throw new Error("Dictionary." + methodName + ": Value may not be null");
        }
    }

    function assertValueValid(value, methodName) {
        if (value === null) {
            throw new Error("Dictionary." + methodName + ": Value may not be null");
        } else if (typeof value == "undefined") {
            throw new Error("Dictionary." + methodName + ": Value may not be undefined");
        }
    }

    function Dictionary() {
        var that = this, dictionaryObj = {};

        this.get = function(key) {
            assertKeyValid(key, "get");

            var value = dictionaryObj[key];
            return (value instanceof DictionaryValue) ? value.value : null;
        };

        this.put = function(key, value) {
            assertKeyValid(key, "put");
            assertValueValid(value, "put");

            var dictValue = new DictionaryValue(value);
            var oldValue = that.get(key);
            dictionaryObj[key] = dictValue;
            return oldValue;
        };

        this.containsKey = function(key) {
            assertKeyValid(key, "containsKey");
            var value = dictionaryObj[key];
            return (value instanceof DictionaryValue);
		};

		this.containsValue = function(value) {
            assertValueValid(value, "containsValue");
            var dictVal;
            for (var i in dictionaryObj) {
                dictVal = dictionaryObj[i];
                if (dictVal instanceof DictionaryValue && dictVal.value === value) {
                    return true;
                }
            }
            return false;
		};

		this.clear = function() {
			dictionaryObj = {};
		};

		this.isEmpty = function() {
			return !buckets.length;
		};
    }

    Dictionary.prototype = {

    };
})();
