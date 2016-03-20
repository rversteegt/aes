const { compose, curry, __, concat, slice, reduce, repeat, id, flatten, map } = require('ramda');
const { chunk } = require('lodash');
const { roundConstant, sBox, mul2, mul3, mul9, mul11, mul13, mul14 } = require('aescons.js');



/**
 * mirrorIndexes [[a]] -> [[a]]
 */
var mirrorIndexes = xss => {
    var result = [];
    
    for (x = 0; x < xss.length; x++) {
        for (y = 0; y < xss[x].length; y++) {
            result[x][y] = xss[y][x];
        }
    }
    
    return result;
};

/**
 * rows : [a] -> [[a]]
 */
var rows = curry(chunk)(_, 4);

/**
 * columns : [a] -> [[a]]
 */
var columns = compose(mirrorIndexes, rows);

var rotate = (n, xs) => concat(slice(0, n, xs), slice(n, xs.length, xs));

var shiftIndexes = 
    [
         0,  1,  2,  3,
         5,  6,  7,  4,
        10, 11,  8,  9,
        15, 12, 13, 14
    ] 
;

var mixColumn = (xs) => {
    var result = [];
    
    result[0] = mul2[xs[0]] ^ mul3[xs[1]] ^ xs[2]       ^ xs[3];
    result[1] = xs[0]       ^ mul2[xs[1]] ^ mul3[xs[2]] ^ xs[3];
    result[2] = xs[0]       ^ xs[1]       ^ mul2[xs[2]] ^ mul3[xs[3]];
    result[3] = mul3[xs[0]] ^ xs[1]       ^ xs[2]       ^ mul2[xs[3]];
    
    return result;
};       

/**
 * powerf : (a -> a) -> Integer -> (a -> a)
 */
var powerf = compose(reduce(compose, id), repeat);


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
        temp[0] ^= roundConstant[i/4][0];
        temp[1] ^= roundConstant[i/4][1];
        temp[2] ^= roundConstant[i/4][2];
        temp[3] ^= roundConstant[i/4][3];
    } 
    
    result[i][0] = result[i - 4][0] ^ temp[0];
    result[i][1] = result[i - 4][1] ^ temp[1];
    result[i][2] = result[i - 4][2] ^ temp[2];
    result[i][3] = result[i - 4][3] ^ temp[3];

    return result;
};


/**
 * keyExpansion : [Byte] -> [[Byte]]
 */
var keyExpansion = key => {    
    var w = [];
    
    w[0] = [ key[ 0], key[ 1], key[ 2], key[ 3] ];
    w[1] = [ key[ 4], key[ 5], key[ 6], key[ 7] ];
    w[2] = [ key[ 8], key[ 9], key[10], key[11] ];
    w[3] = [ key[12], key[13], key[14], key[15] ];
    
    for (var i = 4; i < 10; i++) {
        w = keyExpansionStep(w, i);
    } 
    
    return w;
};

/**
 * subBytes : [Byte] -> [Byte]
 */
var subBytes = map(sBox);

/**
 * shiftRows : [Byte] -> [Byte]
 */
var shiftRows = map(_, shiftIndexes);

/**
 * mixColumns : [Byte] -> [Byte]
 */
var mixColumns = compose(flatten, flipIndexes, map(mixColumn), columns);

/**
 * addRoundKey : [[Byte]] -> Number -> [Byte] -> [Byte]
 */
var addRoundKey = curry( (w, i, s) => {
    var result = [];
    
    for (var x = 0; x < 4; x++ ) {
        for (var y = 0; y < 4; y++ ) {
            result[x][y] = s[x][y] ^ w[i * 4 + y][x];
        }
    }
    
    return result;    
});

var encrypt = (key, input) => {
    var w = keyExpansion(key);
    
    var state = input;

    state = addRoundKey(state, w, 0);

    for (var i = 1; i < 10; i++) {
        state = subBytes(state);
        state = shiftRows(state);
        state = mixColumns(state);
        state = addRoundKey(state, w, i);
    }

    state = subBytes(state);
    state = shiftRows(state);
    state = addRoundKey(state, w, 10);
  
    for (var j=0; j < 4 * 10; j++) {
        output[j] = state[j%4][Math.floor(j/4)];
    }

    return output;
};


module.exports = {
    cipher : cipher
};
