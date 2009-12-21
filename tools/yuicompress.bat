xcopy ..\hashtable.js ..\dist\jshashtable_src.js
java -jar yuicompressor-2.4.2.jar -o "..\dist\jshashtable.js" "..\hashtable.js"
xcopy ..\license.txt ..\dist
xcopy ..\docs ..\dist