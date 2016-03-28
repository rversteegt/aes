const { compose, curry, concat, flip, slice, reduce, repeat, id } = require('ramda');
const { chunk } = require('lodash');

/**
 * reflectXY [[a]] -> [[a]]
 */
var reflectXY = xss => {
    var result = [];
    
    for (var x = 0; x < xss.length; x++) {
        result[x] = [];
        for (var y = 0; y < xss[x].length; y++) {
            result[x][y] = xss[y][x];
        }
    }
    
    return result;
};

/**
 * rows : [a] -> [[a]]
 */
var rows = (i, xs) => chunk(xs, i);

/**
 * columns : [a] -> [[a]]
 */
var columns = compose(reflectXY, rows);

/**
 * rotate Integer -> [a] -> [a]
 */
var rotate = curry((n, xs) => concat(slice(n, xs.length, xs), slice(0, n, xs)));

/**
 * powerf : (a -> a) -> Integer -> (a -> a)
 */
var powerf = compose(reduce(compose, id), repeat);


module.exports = {
    rows : rows
    , columns : columns
    , rotate : rotate
};
