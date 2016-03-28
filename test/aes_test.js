const { mixColumn } =  require('../src/aes.js');

const assert = require('assert');


describe('aes', function() {

    describe('mixColumn', function() {
        const input1 = [0xdb, 0x13, 0x53, 0x45];
        const output1 = [0x8e, 0x4d, 0xa1, 0xbc];

        it('should follow wikipedia example 1', function() {
            assert.deepEqual(output1, mixColumn(input1));
        });

        const input2 = [0xf2, 0x0a, 0x22, 0x5c];
        const output2 = [0x9f, 0xdc, 0x58, 0x9d];

        it('should follow wikipedia example 2', function() {
            assert.deepEqual(output2, mixColumn(input2));
        });

        const input3 = [0x01, 0x01, 0x01, 0x01];
        const output3 = [0x01, 0x01, 0x01, 0x01];

        it('should follow wikipedia example 3', function() {
            assert.deepEqual(output3, mixColumn(input3));
        });
    });
});