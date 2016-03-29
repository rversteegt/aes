var { encrypt } = require('./aes');
var { decrypt } = require('./aes-dec');

var { compose, map, concat, flatten } = require('ramda');
var { rows } = require('./arrays.js');

var ecbEncrypt = (key) => compose(flatten, map(encrypt(key)), rows(4));

var ecbEncryptPadded = (key, input) => {
	while (input.length % 4 !== 0) {
		input = concat(input, 0x00);
	}

	return ecbEncrypt(key)(input);
};

var ecbDecrypt = (key) => compose(flatten, map(encrypt(key)), rows(4));

var ecbDecryptPadded = (key, input) => ecbDecrypt(key)(input);

module.exports = {
	ecbEncrypt : ecbEncryptPadded,
	ecbDecrypt : ecbDecryptPadded
};
