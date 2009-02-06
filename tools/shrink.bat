java -jar shrinksafe.jar ..\hashtable.js > ..\dist\jshashtable_temp.js
jsmin <..\dist\jshashtable_temp.js >..\dist\jshashtable.js
del ..\dist\jshashtable_temp.js
xcopy ..\hashtable.js ..\dist\jshashtable_src.js
xcopy ..\license.txt ..\dist
xcopy ..\docs ..\dist