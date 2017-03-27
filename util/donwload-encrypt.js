
var fs = require('fs');
var http = require('crypto');
var Q = require('q');
var request = require('request');


function download(url, filepath) {
    let url = 'http://example.com/super-sensitive-data.json';  
    let pwd = new Buffer('myPassword');

    let aesTransform = crypto.createCipher('aes-256-cbc', pwd);  
    let fileStream = fs.createWriteStream('encrypted.json');

    request(url)  
        .pipe(aesTransform)     // Encrypts with aes256
        .pipe(fileStream)       // Write encrypted data to a file
        .on('finish', function() {
            console.log('Done downloading, encrypting, and saving!');
        });
}

module.exports = download