var request = require('request');
var fs = require('fs'); // fs para escrever diretamente para o disco, much win
var Puid = require('puid');
var puid = new Puid(); // Isso aqui gera ID únicos, assim nunca vai sobreescrever
var path = require('path');
var Promise = require('bluebird');

/* 
var download2 = require("./util/download2")

download2('http://l4.yimg.com/nn/fp/rsz/112113/images/smush/aaroncarter_635x250_1385060042.jpg', './downloads')
    .then(function(id){
        console.log('Arquivo gravado com id %s', id);
    })
    .catch(function(err){
        console.log('Deu pau..');
        console.log(err.stack);
    });
*/

var download = function(arquivo, pasta, callback){
    var p = new Promise(function(resolve, reject){
        var id = puid.generate();
        var dest = path.join(pasta, id);
        var writeStream = fs.createWriteStream(dest);

        // Avisando a promise que acabamos por aqui
        writeStream.on('finish', function(){
            resolve(id);
        });

        // Capturando erros da write stream
        writeStream.on('error', function(err){
            fs.unlink(dest, reject.bind(null, err));
        });

        var readStream = request.get(arquivo);

        // Capturando erros da request stream
        readStream.on('error', function(err){
            fs.unlink(dest, reject.bind(null, err));
        });

        // Iniciando a transferência de dados
        readStream.pipe(writeStream);
    });

    // Manter compatibilidade com callbacks
    if(!callback)
        return p;

    p.then(function(id){
        callback(null, id);
    }).catch(function(err){
        callback(err);
    });
};

module.exports = download;