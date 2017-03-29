var http = require("http")
var request = require("request");
var rp = require('request-promise');
var parse = require('parse-link');
var git = require('simple-git')
var path = require('path')
//var Q = require('q');
var clc = require('cli-color');
var fs = require('fs');
var unzip = require('unzip');
var fstream = require('fstream');
var ProgressBar = require('progress');
var Promise = require('bluebird');
Promise.promisifyAll(fs);

//----------------
// Exports
//----------------
module.exports.installRemotePart = installRemotePart
module.exports.installPart = installPart
module.exports.install = install
module.exports.downloadGitPackage = downloadGitPackage
module.exports.downloadGitPackage = downloadGitPackage
module.exports.promiseGetRemoteJson = promiseGetRemoteJson
module.exports.downloadExtract = downloadExtract

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

//Install Part from remote location
function installRemotePart(url) {
  var p =
    promiseGetRemoteJson(url)
      .then(convertToPartObj)
      .then(downloadPartDeps)
      .catch(function (reason) {
        console.warn(reason)
      });
  return p
}


//Install from local location
function installPart(file) {
  var p = promiseRequire(file)
    .then(convertToPartObj)
    .then(downloadPartDeps)
    .catch(function (reason) {
      console.warn(reason)
    });
  return p
}

//Install full local package
function install(directory) {
  var promise = loadLocalPackage(directory)
    .then(convertToPackageObj)
    .then(log)
    .then(downloadDeps)
  return promise

  //Promise helpers
  function loadLocalPackage(directory) {
    return new Promise(function () { return require(directory + "/package.json"); })
    //return Q.fcall(function () { return require(directory + "/package.json"); });
  }
}

//Install full package
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
function promiseGetRemoteJson(url) {
  var options = {
    uri: url,
    method: 'GET',
    json: true
  }
  return rp(options);
}
function convertToPartObj(data) { return new Part(data) }
function downloadPartDeps(part) { part.downloadAll("./components/" + part._obj.name); }
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
  return new Promise(function () { return require(file); })
  // return Q.fcall(function () { return require(file); });
}
  function downloadExtract(url, destination) {
    return download(url, destination)
      .then(function () { return extractAll(destination) })
      .then(function () { fs.unlinkSync(destination) })
  }


function createComponentsFolder() {
  return new Promise(function () {
    directory = "./components/"
    //Create dir if not exist
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }
  });
}

  //------------
  // Promise Handlers
  //------------
  function promiseDownload(url, destination) {
    console.log("Downloading..." + clc.green(url));
    return download(url, destination)
      .then(function () { console.log("Download complete", destination) })
  }
  function promiseExtractDelete(fileToUnzip) {
    return extractAll(fileToUnzip)
      .then(function () { fs.unlinkSync(fileToUnzip) })
  }



  //Returns Promise
  function extractAll(zipfile) {
    var to = path.dirname(zipfile)
    console.log("Unzipping all files from " + clc.green(zipfile) + " to " + clc.green(to));

    
      
    return new Promise((resolve, reject) => {
      var zipReadStream = fs.createReadStream(zipfile);
      var writeStream = fstream.Writer(to) //fs.createWriteStream(destination);  //fstream.Writer(path.dirname(destination));

      //Get zip stats
      var stats = fs.statSync(zipfile)
      console.log("Zip archive is " + clc.green(stats.size) + " b ");

      var bar = new ProgressBar(':bar', { total: 10 });
      var bar = new ProgressBar('  extracting [:bar] :percent :etas', {
        complete: '=',
        incomplete: ' ',
        width: 20,
        total: stats.size
      });


      //Zip Progress
      var zipSize = stats.size;
      var uploadedSize = 0; // Incremented by on('data') to keep track of the amount of data we've uploaded
      zipReadStream.on('data', function (chunk) {
        bar.tick(chunk.length);
        //var segmentLength = buffer.length;
        // Increment the uploaded data counter
        //uploadedSize += segmentLength;
        // Display the upload percentage
        //console.log("Progress:\t", ((uploadedSize / zipSize * 100).toFixed(2) + "%"));
      });

      zipReadStream
        .pipe(unzip.Parse())
        .pipe(writeStream)
        .on("finish", () => { resolve(true); }) // not sure why you want to pass a boolean
        .on("error", reject) // don't forget this!
    });

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

  
//------------
// Part Class
//------------
var download = require("./util/download")
var uuid = require('node-uuid');
const validFilename = require('valid-filename');

function Part(obj) {
  var self = this
  var directory = "./components/"

  //Public properties
  this.name = "no-name"
  this.title = "no title"
  this.description
  this.files = []
  this._obj
  //Public Methods
  this.load = load
  this.downloadAll = downloadAll

  //Init
  loadFromObj(obj)

  //Functions
  function loadFromObj(obj) {
    if (!obj || !obj.name) {
      console.warn("No valid object provided", obj)
      throw "No valid object provided", obj
    }
    self._obj = obj
    self.name = obj.name
    self.title = obj.title
    self.description = obj.description
    self.files = obj.files
  }


  //Load a resource from a package
  //TODO Which style to store the files?
  //flat list / or each type in own directory?
  //var parsed = parse(decEndpoint)
  function downloadAll(to) {
    //Create components directory if not exist
    createComponentsFolder()

    //Create part dir if not exist
    if (self.name) directory = "./components/" + self.name
    directory = to || directory;
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

      //Check filename
      var filename = path.basename(file.url)
      if (!validFilename(filename)) {
        throw "Not a valid filename"
        //filename = uuid.v4() + '.zip'  //TODO Add valid extension?
      }

      //Create destination
      var destination = path.join(directory, filename);

      //console.log(filename)
      if (file.skip) {
        console.warn("This file has been marked to be skipped by the creator " + clc.green(file.url));
        continue;
      }


      //Check if file already exists?
      var exists = fs.existsSync(destination)
      if (exists) {
        console.warn("File " + clc.green(destination) + " already exist, use the -force option to redownload the file")
        continue;
      }

      if (!file.extract) promiseDownloadAll.push(promiseDownload(file.url, destination))
      if (file.extract) promiseDownloadAll.push(downloadExtract(file.url, destination))

      // if (file.extract) {
      //   promiseDownloadAll.push(downloadextract(file.url, destination))
      // } else {
      //   promiseDownloadAll.push(download(file.url, destination))
      // }

    }
    return Promise.all(promiseDownloadAll).then(log);
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


