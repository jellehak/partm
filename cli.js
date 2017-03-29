var argv = require('optimist').argv;
var partm = require('./partm');
var commands = require('./util/commands');
//const shell = require('electron').shell;


//console.log(argv)
//console.log("CWD",process.cwd())
var cwd = process.cwd()



commands.add("read",read)
commands.add("install",install)
//commands.add("remove",remove)
commands.add("update",update)
commands.add("version",version)
//commands.add("add",add)
commands.run(argv._);


//-------------
// Command handlers
//-------------
function read(argv) {
  var endpoint = argv[1]

  return partm.promiseGetRemoteJson(endpoint)
  .then(function (data) {
    console.log(data)
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


