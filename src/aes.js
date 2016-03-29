const { compose, curry, __, concat, slice, reduce, repeat, id, flatten, map } = require('ramda');
const { chunk } = require('lodash');
const { roundConstant, sBox, mul2, mul3, mul9, mul11, mul13, mul14 } = require('./aescons.js');
const { rows, columns, rotate, reflectXY } = require('./arrays.js');
const { trace, noop } = require('./util.js');


var mixColumn = (xs) => {
    var result = [];
    
    result[0] = mul2[xs[0]] ^ mul3[xs[1]] ^ xs[2]       ^ xs[3];
    result[1] = xs[0]       ^ mul2[xs[1]] ^ mul3[xs[2]] ^ xs[3];
    result[2] = xs[0]       ^ xs[1]       ^ mul2[xs[2]] ^ mul3[xs[3]];
    result[3] = mul3[xs[0]] ^ xs[1]       ^ xs[2]       ^ mul2[xs[3]];
    
    return result;
};       

var roundCount = 10;

/**
 * keyExpansionStep : [[Byte]] -> Integer -> [[Byte]]
 */
var keyExpansionStep = (w, i) => {
    var result = w;
    
    var temp = [];
    
    temp[0] = w[i - 1][0];
    temp[1] = w[i - 1][1];
    temp[2] = w[i - 1][2];
    temp[3] = w[i - 1][3];
    
    if (i % 4 === 0) {
        temp = compose(map(sBox), rotate)(temp);
        temp[0] ^= roundConstant[i / 4][0];
        temp[1] ^= roundConstant[i / 4][1];
        temp[2] ^= roundConstant[i / 4][2];
        temp[3] ^= roundConstant[i / 4][3];
    } 
    
    result[i] = [];
    result[i][0] = result[i - 4][0] ^ temp[0];
    result[i][1] = result[i - 4][1] ^ temp[1];
    result[i][2] = result[i - 4][2] ^ temp[2];
    result[i][3] = result[i - 4][3] ^ temp[3];

    return result;
};

var rotWord = rotate(1);

var subWord = map(x => sBox[x]);

/**
 * keyExpansion : [Byte] -> [[Byte]]
 */
var keyExpansion = key => {    
    var fn = compose(subWord, rotWord);

    var w = [];
    var temp = [];
    
    w[0] = [ key[ 0], key[ 1], key[ 2], key[ 3] ];
    w[1] = [ key[ 4], key[ 5], key[ 6], key[ 7] ];
    w[2] = [ key[ 8], key[ 9], key[10], key[11] ];
    w[3] = [ key[12], key[13], key[14], key[15] ];

    for (var i = 4; i < 44; i++) {
        w[i] = [];

        temp[0] = w[i - 1][0];
        temp[1] = w[i - 1][1];
        temp[2] = w[i - 1][2];
        temp[3] = w[i - 1][3];

        if (i % 4 === 0) {
            temp = fn(temp);
            temp[0] ^= roundConstant[i / 4][0];
            temp[1] ^= roundConstant[i / 4][1];
            temp[2] ^= roundConstant[i / 4][2];
            temp[3] ^= roundConstant[i / 4][3];
        }

        w[i][0] = w[i - 4][0] ^ temp[0];
        w[i][1] = w[i - 4][1] ^ temp[1];
        w[i][2] = w[i - 4][2] ^ temp[2];
        w[i][3] = w[i - 4][3] ^ temp[3];
    }

    return w;
};

/**
 * subBytes : [Byte] -> [Byte]
 */
var subBytes = map(x => sBox[x]);

/**
 * shiftRows : [Byte] -> [Byte]
 */
var shiftRows = xs => {
    const shiftIndexes =
        [
             0,  1,  2,  3,
             5,  6,  7,  4,
            10, 11,  8,  9,
            15, 12, 13, 14
        ]
    ;

    var result = [];

    for (var i = 0; i < xs.length; i++) {
        result[i] = xs[shiftIndexes[i]];
    }

    return result;
};

/**
 * mixColumns : [Byte] -> [Byte]
 */
var mixColumns = compose(flatten, reflectXY, map(mixColumn), columns(4));

/**
 * addRoundKey : [[Byte]] -> Number -> [Byte] -> [Byte]
 */
var addRoundKey = curry( (w, i, s) => {
    var r = rows(4, s);
    var result = [];

    for (var x = 0; x < 4; x++ ) {
        result[x] = [];
        for (var y = 0; y < 4; y++ ) {
            result[x][y] = r[x][y] ^ w[i * 4 + y][x];
        }
    }
    
    return flatten(result);
});

var encrypt = (key, input) => {
    var w = keyExpansion(key);
    
    var state = input;console.log(state);
    
    state = addRoundKey(w, 0, state);console.log(state);

    for (var i = 1; i < 10; i++) {
        state = subBytes(state);console.log(state);
        state = shiftRows(state);console.log(state);
        state = mixColumns(state);console.log(state);
        state = addRoundKey(w, i, state);console.log(state);
    }

    state = subBytes(state);console.log(state);
    state = shiftRows(state);console.log(state);
    state = addRoundKey(w, 10, state);console.log(state);

    return state;
};


module.exports = {
      mixColumn : mixColumn
    , mixColumns : mixColumns
    , shiftRows : shiftRows
    , subBytes : subBytes
    , keyExpansion : keyExpansion
    , rotWord : rotWord
    , subWord : subWord
    , addRoundKey : addRoundKey
    , encrypt : encrypt
};
