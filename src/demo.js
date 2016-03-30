var { compose, map, join } = require('ramda');

var { ecbEncrypt, ecbDecrypt } = require('./aes-ecb.js');

var fs = require('fs');


var write = function(file, data) {
    fs.writeFile(file, data, function(err) {
        if(err) {
            return console.log(err);
        }
    });
};

var char = s => s.charAt(0);

var ichar = i => String.fromCharCode(i);

var split = s => s.split('');

var toCharArray = compose(map(char), split);

var itoCharArray = compose(join(''), map(ichar));


const key =
      [
          0x2b, 0x7e, 0x15, 0x16,
          0x28, 0xae, 0xd2, 0xa6,
          0xab, 0xf7, 0x15, 0x88,
          0x09, 0xcf, 0x4f, 0x3c,
      ]
;

fs.readFile('./plaintext.txt', 'utf8', function (err,plaintext) {
    if (err) {
        return console.log(err);
    }

    var cipher = ecbEncrypt(key, plaintext);
    plaintext = ecbDecrypt(key, cipher);

    write("./decryptedcipher.txt", itoCharArray(plaintext));
});
