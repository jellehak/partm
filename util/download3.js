
var fs = require('fs');
var http = require('http');
var Q = require('q');
var request = require('request');
var rp = require('request-promise');

function download(url, filepath) {
    //let url = 'http://example.com/super-sensitive-data.json';  
    //let pwd = new Buffer('myPassword');
      var options = {
        uri: url,
        headers: {
            'User-Agent': 'Request-Promise'
        }
    };

    let fileStream = fs.createWriteStream(filepath);

    var p = rp(options) 
        .pipe(fileStream)       // Write data to a file
    return p
}



/*

function download(url, filepath) {
    var fileStream = fs.createWriteStream(filepath),
        deferred = Q.defer();

    var options = {
        host: url,
        headers: {
            'User-Agent': 'Request-Promise'
        }
    };

    fileStream.on('open', function () {
        http.get(options, function (res) {
            res.on('error', function (err) {
                deferred.reject(err);
            });

            res.pipe(fileStream);
        });
    }).on('error', function (err) {
        deferred.reject(err);
    }).on('finish', function () {
        deferred.resolve(filepath);
    });

    return deferred.promise;
}
*/

/*
//var request = require('request');
//var rp = require('request-promise');
function download2(url) {
    //var url = 'http://l4.yimg.com/nn/fp/rsz/112113/images/smush/aaroncarter_635x250_1385060042.jpg';
    var r = rp(url);
    console.log(r)
    r.on('response',  function (res) {
        res.pipe(fs.createWriteStream('./' + res.headers.date + '.' + res.headers['content-type'].split('/')[1]));
    });
    return r
}
*/

module.exports = download