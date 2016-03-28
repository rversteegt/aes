const { rows, columns, rotate, powerf} = require('../src/arrays.js');

const assert = require('assert');

describe('rext', function() {

    describe('rows', function() {
        const flattened = 
            [
                  1, 2, 3
                , 4, 5, 6
                , 7, 8, 9
            ]
        ;


        const rows3 = 
            [
                  [1, 2, 3]
                , [4, 5, 6]
                , [7, 8, 9]
            ]
        ;

        it('should return the rows with 3', function() {
            assert.deepEqual(rows3, rows(3, flattened));
        });
    });

    describe('columns', function () {
        const flattened = 
            [
                  1, 2, 3
                , 4, 5, 6
                , 7, 8, 9
            ]
        ;


        const columns3 = 
            [
                  [1, 4, 7]
                , [2, 5, 8]
                , [3, 6, 9]
            ]
        ;

        it('should return the columns with 3', function() {
            assert.deepEqual(columns3, columns(3, flattened));
        });
    });

    describe('rotate', function () {
        const array = 
            [
                1, 2, 3, 4, 5, 6, 7, 8, 9 , 10
            ]
        ;

        const rotated =
            [
                5, 6, 7, 8, 9 , 10, 1, 2, 3, 4
            ]
        ;

        var rotate4 = rotate(4);

        it('should rotate the array by 4', function() {
            assert.deepEqual(rotated, rotate4(array));
        });

        it('should not affect empty arrays', function() {
            assert.deepEqual([], rotate4([]));
        });
    });
});
