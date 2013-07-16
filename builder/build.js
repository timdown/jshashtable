var http = require("http");
var fs = require("fs");
var path = require("path");
var util = require("util");
var exec = require("child_process").exec;

var FILE_ENCODING = "utf-8";

var buildSpec = {
    baseVersion: "3.0",
    svnUrl: "http://jshashtable.googlecode.com/svn/trunk/"
};

var buildDir = "build/";

var svnDir = buildDir + "checkout/", srcDir = svnDir + "trunk/";
var zipDir;
var uncompressedBuildDir;
var allScripts = [
    "hashtable.js",
    "hashset.js"
];

var buildVersion;

function copyFileSync(srcFile, destFile) {
    var BUF_LENGTH, buff, bytesRead, fdr, fdw, pos;
    BUF_LENGTH = 64 * 1024;
    buff = new Buffer(BUF_LENGTH);
    fdr = fs.openSync(srcFile, "r");
    fdw = fs.openSync(destFile, "w");
    bytesRead = 1;
    pos = 0;
    while (bytesRead > 0) {
        bytesRead = fs.readSync(fdr, buff, 0, BUF_LENGTH, pos);
        fs.writeSync(fdw, buff, 0, bytesRead);
        pos += bytesRead;
    }
    fs.closeSync(fdr);
    return fs.closeSync(fdw);
}

function deleteBuildDir() {
    // Delete the old build directory
    if (fs.existsSync(buildDir)) {
        var rimraf = require("rimraf");
        rimraf(buildDir, function() {
            console.log("Deleted old build directory");
            callback();
        });
    } else {
        console.log("No existing build directory");
        callback();
    }
}

function createBuildDir() {
    fs.mkdirSync(buildDir);
    fs.mkdirSync(svnDir);
    console.log("Created build directory " + path.resolve(buildDir));
    callback();
}

function checkoutSvnRepository() {
    exec("svn checkout " + buildSpec.svnUrl, { cwd: svnDir }, function(error, stdout, stderr) {
        console.log("Checked out SVN repository to " + svnDir + " ", stdout, stderr);
        callback();
    });
}

function getVersion() {
    exec("svnversion", function(error, stdout, stderr) {
        buildVersion = buildSpec.baseVersion/* + "." + stdout.trim().replace(/:/g, "_")*/;
        zipDir = buildDir + "jshashtable-" + buildVersion + "/";
        fs.mkdirSync(zipDir);
        uncompressedBuildDir = zipDir + "uncompressed/";
        fs.mkdirSync(uncompressedBuildDir);
        console.log("Got SVN version ", stdout, stderr);
        callback();
    });
}

function copyScripts() {
    allScripts.forEach(function(scriptFile) {
        copyFileSync(srcDir + scriptFile, uncompressedBuildDir + scriptFile);
    });
    console.log("Copied scripts");
    callback();
}

function copyDocs() {
    var srcDocsDir = srcDir + "docs/";
    var docsBuildDir = zipDir + "docs/";
    fs.mkdirSync(docsBuildDir);
    ["index.html", "jshashset.html", "main.css"].forEach(function(fileName) {
        copyFileSync(srcDocsDir + fileName, docsBuildDir + fileName);
    });
    callback();
}

function clean() {
    var rimraf = require("rimraf");
    rimraf(svnDir, function() {
        console.log("Deleted SVN directory");
        callback();
    });
}

function substituteBuildVars() {
    // Substitute build vars in scripts
    function substituteBuildVars(file, buildVars) {
        var contents = fs.readFileSync(file, FILE_ENCODING);
        contents = contents.replace(/%%build:([^%]+)%%/g, function(matched, buildVarName) {
            return buildVars[buildVarName];
        });
        fs.writeFileSync(file, contents, FILE_ENCODING);
    }

    var date = new Date();
    var month = "January,February,March,April,May,June,July,August,September,October,November,December".split(",")[date.getMonth()];

    var buildVars = {
        version: buildVersion,
        date: date.getDate() + " " + month + " " + date.getFullYear(),
        year: date.getFullYear()
    };

    allScripts.forEach(function(fileName) {
        substituteBuildVars(uncompressedBuildDir + fileName, buildVars);
    });

    console.log("Substituted build vars in scripts");
    callback();
}

function minify() {
    var error = false;

    function getLicence(srcFile) {
        var contents = fs.readFileSync(srcFile, FILE_ENCODING);
        var result = /^\s*\/\*\*[\s\S]*?\*\//.exec(contents);
        return result ? result[0] : "";
    }

    // Uglify
    function uglify(src, dest) {
        var licence = getLicence(src);
        var uglify = require("uglify-js");

        try {
            var final_code = uglify.minify(src, {
                ascii_only: true
            });

            fs.writeFileSync(dest, licence + "\r\n" + final_code.code, FILE_ENCODING);
        } catch (ex) {
            console.log(ex, ex.stack);
            error = true;
        }
    }

    allScripts.forEach(function(fileName) {
        uglify(uncompressedBuildDir + fileName, zipDir + fileName);
    });

    if (error) {
        console.log("Uglify failed");
    } else {
        console.log("Minified scripts");
        callback();
    }
}

function zip() {
    var zipFileName = "jshashtable-" + buildVersion + ".zip";
    var tarName = "jshashtable-" + buildVersion + ".tar";
    var tarGzName = "jshashtable-" + buildVersion + ".tar.gz";
    var zipExe = "..\\builder\\tools\\7za";
    var dir = "jshashtable-" + buildVersion + "/";

    exec(zipExe + " a -tzip " + zipFileName + " " + dir, { cwd: buildDir }, function(error, stdout, stderr) {
        console.log("Zipped", stdout, stderr);

        exec(zipExe + " a -ttar " + tarName + " " + dir, { cwd: buildDir }, function(error, stdout, stderr) {
            console.log("Tarred", stdout, stderr);
            exec(zipExe + " a -tgzip " + tarGzName + " " + tarName, { cwd: buildDir }, function(error, stdout, stderr) {
                console.log("Gzipped", stdout, stderr);
                fs.unlinkSync(buildDir + tarName);
                callback();
            });
        });
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/

// Start the build

var actions = [
    deleteBuildDir,
    createBuildDir,
    checkoutSvnRepository,
    getVersion,
    copyScripts,
    copyDocs,
    clean,
    substituteBuildVars,
    minify,
    zip
];


function callback() {
    if (actions.length) {
        actions.shift()();
    } else {
        console.log("Done");
    }
}

console.log("Starting build...");
callback();
