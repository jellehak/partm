var http = require("http")
var request = require("request");
var rp = require('request-promise');
var parse = require('parse-link');
var git = require('simple-git')
var path = require('path')
var Q = require('q');
var clc = require('cli-color');
var fs = require('fs');
var unzip = require('unzip');
var fstream = require('fstream');

//----------------
//App test
//----------------
// installPart("./downloads/partm-hammond-sample/1455D602.json")
//   //install("https://github.com/jellehak/partm-hammond-sample.git")
//   .then(function (data) {
//     //console.log(data)
//   })


//----------------
// Helpers
//----------------
//Q.fcall(function () {    return 10; });



function installRemotePart(file, cwd) {
  //var downloadTo = path.join(cwd,"blalba.json")
  //console.log("File has been saved to ",clc.green(downloadTo))

  var p =
    getRemoteJson()
      //download(file,downloadTo)
      //.then(function() { return require(downloadTo)})
      //.then(log)
      .then(convertToPartObj)
      .then(downloadPartDeps)
      .catch(function (reason) {
        console.warn(reason)
      });
  return p

  //Promise helpers
  function getRemoteJson() {
    var options = {
      uri: file,
      method: 'GET',
      json: true
    }
    return rp(options);
  }
  function convertToPartObj(data) { return new Part(data) }
  function downloadPartDeps(part) { part.downloadAll("./components/" + part._obj.name); }
}




function installPart(file) {
  var p = promiseRequire(file)
    .then(convertToPartObj)
    .then(downloadPartDeps)
    .catch(function (reason) {
      console.warn(reason)
    });
  return p

  //Promise helpers
  function convertToPartObj(data) { return new Part(data) }
  function downloadPartDeps(part) { part.downloadAll(); }
}


function install(directory) {
  var promise = loadLocalPackage(directory)
    .then(convertToPackageObj)
    .then(log)
    .then(downloadDeps)
  return promise

  //Promise helpers
  function loadLocalPackage(directory) {
    return Q.fcall(function () { return require(directory + "/package.json"); });
  }
}

function downloadGitPackage(git) {
  var promise = downloadPackageFromGit(git)
    .then(convertToPackageObj)
    .then(log)
    .then(downloadPackageFiles)
    .then(downloadDeps)

  return promise
}



//----------
// Global Promise handlers
//----------
function log(data) { console.log(data); return data; }
function convertToPackageObj(json) { return new Package(json) }
function downloadPackageFromGit(git) {
  var url = resourceToUrl(git)
  console.log("Loading package from " + url)
  return rp({
    url: url,
    json: true
  })
}
function promiseRequire(file) {
  return Q.fcall(function () { return require(file); });
}



//------------
// Part Class
//------------
var download = require("./util/download")

function Part(obj) {
  var self = this
  var directory = "./components/"

  //Public properties
  this.name = "no-name"
  this.title = "no title"
  this.description
  this.files = []
  this._obj
  //Methods
  this.load = load
  this.downloadAll = downloadAll

  //Init
  loadFromObj(obj)

  //Functions
  function loadFromObj(obj) {
    self._obj = obj
    self.name = obj.name
    self.title = obj.title
    self.description = obj.description
    self.files = obj.files
  }

  // function unzipFiles() {

  // }

  //Load a resource from a package
  function downloadAll(to) {
    //Create dir?
    if (self.name) directory = "./components/" + self.name
    directory = to || directory;

    //Create dir if not exist
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }

    console.log("Installing files to directory ", clc.green(directory))
    //logFiles()

    promiseDownloadAll = []
    //promiseDownloadAll.push( 100 )
    //promiseDownloadAll.push( download("http://l4.yimg.com/nn/fp/rsz/112113/images/smush/aaroncarter_635x250_1385060042.jpg","blalba.jpg") )
    for (var k in self.files) {
      var file = self.files[k]
      //console.log(file)
      var filename = path.basename(file.url)
      //console.log(filename)
      //TODO Which style to store the files?
      //flat list / or each type in own directory?
      //var parsed = parse(decEndpoint)

      if (file.skip) {
        console.warn("This file has been marked to be skipped by the creator " + clc.green(file.url));
        continue;
      }
      var destination = path.join(directory, filename);
      var exists = fs.existsSync(destination)

      if (!exists) {
        if (file.extract) {
          promiseDownloadAll.push(downloadextract(file.url, destination))
        } else {
          promiseDownloadAll.push(download(file.url, destination))
        }
      } else {
        console.warn("File " + clc.green(destination) + " already exist, use the -force option to redownload the file")
      }
    }
    return Q.all(promiseDownloadAll).then(log);
  }

  function downloadextract(url, destination) {
    download(url, destination)
      .then(function () {
        return extractAll(destination)
      })
      .then(function () {
        fs.unlinkSync(destination)
      })
  }

  function extractAll(destination) {
    console.log("Unzipping all files from " + clc.green(destination) + " to the same directory");
    var readStream = fs.createReadStream(destination);
    var writeStream = fstream.Writer(path.dirname(destination));

    return readStream
      .pipe(unzip.Parse())
      .pipe(writeStream)
  }

  function extractFiles(destination) {
    console.log("Unzipping...", clc.green(destination));
    return fs.createReadStream(destination)
      .pipe(unzip.Parse())
      .on('entry', function (entry) {
        var fileName = entry.path;
        var type = entry.type; // 'Directory' or 'File' 
        var size = entry.size;
        if (fileName === "this IS the file I'm looking for") {
          entry.pipe(fs.createWriteStream('output/path'));
        } else {
          entry.autodrain();
        }
      });
  }


  //Load a resource from a package
  function load(decEndpoint) {

  }

  function logFiles() {
    for (k in self.files) { var decEndpoint = self.files[k]; console.log(decEndpoint) }
  }
}





//------------
// Package Class
//------------
function Package(obj) {
  var self = this

  //Public properties
  this.title = "no title"
  this.description
  this.files = []
  this.base
  //Methods
  this.load = load

  //Init
  loadFromObj(obj)

  //Functions
  function loadFromObj(obj) {
    self.title = obj.title
    self.description = obj.description
    self.files = obj.files
    self.decEndpoint = "https://github.com/jellehak/partm-hammond-sample.git"
  }

  //Load a part description from the package
  function load(file) {
    return rp({
      url: url,
      json: true
    })
  }
}


// //Endpoint loader
// function EndPoint(decEndpoint) {
//   this.load = load

// }


//Download all deps from a package
function downloadDeps(package) {
  console.log("Donwloading all parts from package.json..." + clc.green(package.title))

  //return {"message":"Done"}
  for (k in package.files) {
    var file = package.files[k]
    console.log(file)
    package.load(file)
    //resourceToUrl(git)
  }
}


//-----------
// Helpers
//-----------
function resourceToUrl(decEndpoint) {
  var output = gitHubToUrl(decEndpoint) || decEndpoint
  //Add more decEndpoint
  return output;
}

//Convert git link to the main package url
function gitHubToUrl(git) {
  parsed = parse(git);
  var gitpath = parsed.pathname.slice(0, -4); // remove .git
  return "https://raw.githubusercontent.com" + gitpath + "/master/package.json"
}


module.exports.installRemotePart = installRemotePart
module.exports.installPart = installPart
module.exports.install = install
module.exports.downloadGitPackage = downloadGitPackage