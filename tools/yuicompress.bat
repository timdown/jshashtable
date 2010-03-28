xcopy ..\hashtable.js ..\dist\jshashtable_src.js
xcopy ..\hashset.js ..\dist\jshashset_src.js
java -jar yuicompressor-2.4.2.jar -o "..\dist\jshashtable.js" "..\hashtable.js"
java -jar yuicompressor-2.4.2.jar -o "..\dist\jshashset.js" "..\hashset.js"
xcopy ..\license.txt ..\dist
xcopy ..\docs ..\dist