var http = require("http")
var request = require("request");
var rp = require('request-promise');
var parse = require('parse-link');
var git = require('simple-git')
var path = require('path')
var Q = require('q');
var clc = require('cli-color');

var options = {
    uri: 'http://www.hammondmfg.com/jpeg2/1455P1602_A2_B.jpg',
    qs: {
        access_token: 'xxxxx xxxxx' // -> uri + '?access_token=xxxxx%20xxxxx'
    },
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
};

rp(options)
    .then(function (htmlString) {
        // Process html...
        console.log(htmlString)
    })
    .catch(function (err) {
        // Crawling failed...
        console.log(err)
    });