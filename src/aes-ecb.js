var { encrypt } = require('./aes');
var { decrypt } = require('./aes-dec');

var { compose, map, concat, flatten, curry } = require('ramda');
var { rows, columns } = require('./arrays.js');
var { trace } = require('./util.js');

var ecbEncrypt = (key) => compose(flatten, map(encrypt(key)), rows(16));

var ecbEncryptPadded = curry( (key, input) => {
	while (input.length % 4 !== 0) {
		input = concat(input, 0x00);
	}

	return ecbEncrypt(key)(input);
});

var ecbDecrypt = (key) => compose(flatten, map(decrypt(key)), rows(16));

var ecbDecryptPadded = curry( (key, input) => ecbDecrypt(key)(input) );

module.exports = {
	ecbEncrypt : ecbEncryptPadded,
	ecbDecrypt : ecbDecryptPadded
};
