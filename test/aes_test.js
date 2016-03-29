const { mixColumn, mixColumns, shiftRows, subBytes, rotWord, subWord, keyExpansion } =  require('../src/aes.js');

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

    describe('mixColumns', function() {
        const input1 = 
            [
                0xd4, 0xe0, 0xb8, 0x1e,
                0xbf, 0xb4, 0x41, 0x27,
                0x5d, 0x52, 0x11, 0x98,
                0x30, 0xae, 0xf1, 0xe5,
            ]
        ;

        const output1 = 
            [
                0x04, 0xe0, 0x48, 0x28,
                0x66, 0xcb, 0xf8, 0x06,
                0x81, 0x19, 0xd3, 0x26,
                0xe5, 0x9a, 0x7a, 0x4c,
            ]
        ;

        it('should follow appendix B: example 1', function() {
            assert.deepEqual(output1, mixColumns(input1));
        });
    });

    describe('shiftRows', function() {      
        const input1 = 
            [
                0xd4, 0xe0, 0xb8, 0x1e,
                0x27, 0xbf, 0xb4, 0x41,
                0x11, 0x98, 0x5d, 0x52,
                0xae, 0xf1, 0xe5, 0x30,
            ]
        ;

        const output1 = 
            [
                0xd4, 0xe0, 0xb8, 0x1e,
                0xbf, 0xb4, 0x41, 0x27,
                0x5d, 0x52, 0x11, 0x98,
                0x30, 0xae, 0xf1, 0xe5,
            ]
        ;

        it('should follow appendix B: example 1', function() {
            assert.deepEqual(output1, shiftRows(input1));
        });
    });

    describe('subBytes', function() {      
        const input1 = 
            [
                0x19, 0xa0, 0x9a, 0xe9,
                0x3d, 0xf4, 0xc6, 0xf8,
                0xe3, 0xe2, 0x8d, 0x48,
                0xbe, 0x2b, 0x2a, 0x08,
            ]
        ;

        const output1 = 
            [
                0xd4, 0xe0, 0xb8, 0x1e,
                0x27, 0xbf, 0xb4, 0x41,
                0x11, 0x98, 0x5d, 0x52,
                0xae, 0xf1, 0xe5, 0x30,
            ]
        ;

        it('should follow appendix B: example 1', function() {
            assert.deepEqual(output1, subBytes(input1));
        });
    });

    describe('rotWord', function() {      
        const input1 = [0x09, 0xcf, 0x4f, 0x3c];

        const output1 = [0xcf, 0x4f, 0x3c, 0x09];

        it('should follow appendix B: example 1', function() {
            assert.deepEqual(output1, rotWord(input1));
        });
    });

    describe('subWord', function() {      
        const input1 = [0xcf, 0x4f, 0x3c, 0x09];

        const output1 = [0x8a, 0x84, 0xeb, 0x01];

        it('should follow appendix B: example 1', function() {
            assert.deepEqual(output1, subWord(input1));
        });
    });



    describe('keyExpansion', function() {      
        const key =  
            [
                0x2b, 0x7e, 0x15, 0x16, 
                0x28, 0xae, 0xd2, 0xa6, 
                0xab, 0xf7, 0x15, 0x88, 
                0x09, 0xcf, 0x4f, 0x3c,
            ]
        ;

        var expansion = keyExpansion(key);

        it('should follow appendix B: example 1', function() {
            assert.deepEqual([0x2b, 0x7e, 0x15, 0x16], expansion[0]);
            assert.deepEqual([0x28, 0xae, 0xd2, 0xa6], expansion[1]);
            assert.deepEqual([0xab, 0xf7, 0x15, 0x88], expansion[2]);
            assert.deepEqual([0x09, 0xcf, 0x4f, 0x3c], expansion[3]);
        });

        it('should follow appendix B: example 1', function() {
            assert.deepEqual([0xa0, 0xfa, 0xfe, 0x17], expansion[4]);
            assert.deepEqual([0x88, 0x54, 0x2c, 0xb1], expansion[5]);
            assert.deepEqual([0x23, 0xa3, 0x39, 0x39], expansion[6]);
            assert.deepEqual([0x2a, 0x6c, 0x76, 0x05], expansion[7]);
            assert.deepEqual([0xf2, 0xc2, 0x95, 0xf2], expansion[8]);
        });
    });
});