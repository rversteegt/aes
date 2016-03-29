const { compose, curry, __, concat, slice, reduce, repeat, id, flatten, map } = require('ramda');
const { mixColumn, mixColumns, shiftRows, subBytes, rotWord, subWord, keyExpansion, addRoundKey, encrypt } =  require('../src/aes.js');
const { rows, columns, rotate, reflectXY } = require('./arrays.js');
const { roundConstant, sBox, inverseSBox, mul2, mul3, mul9, mul11, mul13, mul14 } = require('./aescons.js');



var invShiftRows = xs => {
    const shiftIndexes =
        [
             0,  1,  2,  3,
             7,  4,  5,  6,
            10, 11,  8,  9,
            13, 14, 15, 12
        ]
    ;

    var result = [];

    for (var i = 0; i < xs.length; i++) {
        result[i] = xs[shiftIndexes[i]];
    }

    return result;
};

var invSubBytes = map(x => inverseSBox[x]);

var invMixColumn = (xs) => {
    var result = [];
    
    result[0] = mul14[xs[0]] ^ mul11[xs[1]] ^ mul13[xs[2]] ^ mul9 [xs[3]];
    result[1] = mul9 [xs[0]] ^ mul14[xs[1]] ^ mul11[xs[2]] ^ mul13[xs[3]];
    result[2] = mul13[xs[0]] ^ mul9 [xs[1]] ^ mul14[xs[2]] ^ mul11[xs[3]];
    result[3] = mul11[xs[0]] ^ mul13[xs[1]] ^ mul9 [xs[2]] ^ mul14[xs[3]];
    
    return result;
};

var invMixColumns = compose(flatten, reflectXY, map(invMixColumn), columns(4));

var decrypt = (key, input) => {
	var state = input;

	var w = keyExpansion(key);

	state = addRoundKey(w, 10, state);

	for (var i = 9; i > 0; i--) {
        state = invShiftRows(state);
        state = invSubBytes(state);
        state = addRoundKey(w, i, state);
        state = invMixColumns(state);
    }

    state = invShiftRows(state);
    state = invSubBytes(state);
    state = addRoundKey(w, 0, state);

    return state;
};

module.exports = {
	decrypt : decrypt
};
