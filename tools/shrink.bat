java -jar shrinksafe.jar ../hashtable.js > ../dist/jshashtable_temp.js
jsmin <../dist/jshashtable_temp.js >../dist/jshashtable.js
delete ../dist/jshashtable_temp.js
copy ../hashtable.js ../dist/jshashtable_src.js
copy ../license.txt ../dist
copy ../docs ../dist