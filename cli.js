/*
Handles the CLI
*/
var argv = require('optimist').argv;
var partm = require('./partm');
var commands = require('./util/commands');
//const shell = require('electron').shell;
var path = require('path')
var request = require('request')
var inquirer = require('inquirer');
const opn = require('opn');

//console.log(argv)
//console.log("CWD",process.cwd())
var cwd = process.cwd()


//Temp/Debug commands
commands.add("grabcad", grabcad)
//Commands
commands.add("init", init)
commands.add("open", open)
commands.add("download", download)
commands.add("read", read)
commands.add("install", install)
//commands.add("remove",remove)
commands.add("update", update)
commands.add("version", version)
//commands.add("add",add)
commands.run(argv._);


//-------------
// Command handlers
//-------------
function open(argv) {
  partm.get()
    .then((file) => {
      console.log(file)
      // image viewer closed 
      opn(file.mainfile).then(() => {
        // image viewer closed 
      });
    });
}


function init(argv) {

  var questions = [
    {
      type: 'string',
      message: 'Enter a title',
      name: 'title'
    },
    {
      type: 'string',
      message: 'Enter the filename of the CAD data',
      name: 'mainfile',
      mask: '*'
    }
  ]

  inquirer.prompt(questions)
  .then(function (answers) {
    // Use user feedback for... whatever!! 
    console.log(answers)

    partm.detect().then((components) => {
      console.log(components)
      answers.components = components
    }).then((test) => {
      partm.init(answers)
    })

  })



}


function read(argv) {
  var endpoint = argv[1]

  return partm.promiseGetRemoteJson(endpoint)
    .then(function (data) {
      console.log(data)
    })
}

//Download https://grabcad.com/community/api/v1/models/predator-drone-2/files/download?cadid=0e1eb26bd3c7fed7f8c64a2fed5221ba
function download(argv) {
  var url = argv[1]

  var options = {
    uri: url,
    headers: {
      'User-Agent': 'Request-Promise'
    }
  };

  var req = request(options);

  req.on('response', function (res) {
    res.on('data', function (chunk) {
      console.log(chunk);
    });

    if (res.statusCode === 200) {
      var writeStream = fs.createWriteStream(dest);

      var contentDisposition = res.headers['content-disposition'];
      var match = contentDisposition && contentDisposition.match(/(filename=|filename\*='')(.*)$/);
      var filename = match && match[2] || 'default-filename.out';
      var dest = fs.createWriteStream(filename);
      dest.on('error', function (e) {
        // Handle write errors
        console.log(e);
      });
      dest.on('finish', function () {
        // The file has been downloaded
        console.log('Downloaded ' + filename);
      });
      req.pipe(dest);

    }
    else {
      // Handle HTTP server errors
      console.log(res.statusCode);
    }
  });


  // var directory = "./components/" + self.name
  // var filename = path.basename(url)
  // //Create destination
  // var destination = path.join(directory, filename);

  // return partm.downloadExtract(url, destination)
  //   .then(function (data) {
  //     //console.log(data)
  //   })
}


//https://grabcad.com/library/predator-drone-2
//TODO merge to INSTALL (autodetect)
function grabcad(argv) {
  var endpoint = argv[1]

  return partm.installRemotePart(endpoint)
    .then(function (data) {
      //console.log(data)
    })
}





function install(argv) {
  var endpoint = argv[1]

  return partm.installRemotePart(endpoint)
    .then(function (data) {
      //console.log(data)
    })
}

function update(argv) {

}
function version(argv) {

}
function help(argv) {
  console.log(argv)
}


