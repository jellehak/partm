var http = require("http")
var request = require("request");
var rp = require('request-promise');
var parse = require('parse-link');
var git = require('simple-git')
var path = require('path')
var partm = require('./partm');

//----------------
//App test
//----------------
partm.installPart("./downloads/partm-hammond-sample/1455D602.json")
  //install("https://github.com/jellehak/partm-hammond-sample.git")
  .then(function (data) {
    //console.log(data)
  })
