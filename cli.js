var argv = require('optimist').argv;
var partm = require('./partm');

//console.log(argv)
//console.log("CWD",process.cwd())

var cwd = process.cwd()


//Command handler
var command = argv._[0]
switch(command) {
  case 'add': add(argv); break;
  case 'install': install(argv); break;
  case 'update': update(argv); break;
  case 'version': version(argv); break;
  default: console.log("Unknown command: ",command); help(argv); break;
}

//-------------
// Command handlers
//-------------
function install(argv) {
  var endpoint = argv._[1]

  partm.installRemotePart(endpoint, cwd)
  .then(function (data) {
    console.log(data)
  })
}

function update(argv) {

}
function version(argv) {

}
function help(argv) {
  console.log(argv)
}


//-----------------------------------
//TODO : New style command handler
//Command helpers
var commands = []
function registerCommand(command,fn) {
  commands.push({command:command,fn:fn}) 
}

registerCommand("install",install)
registerCommand("update",update)
registerCommand("version",version)
//registerCommand("add",add)
