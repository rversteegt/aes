const { mixColumn, mixColumns, shiftRows, subBytes, rotWord, subWord, keyExpansion, addRoundKey, encrypt } =  require('../src/aes.js');

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

        it('should follow appendix A.1', function() {
            assert.deepEqual([0x2b, 0x7e, 0x15, 0x16], expansion[0]);
            assert.deepEqual([0x28, 0xae, 0xd2, 0xa6], expansion[1]);
            assert.deepEqual([0xab, 0xf7, 0x15, 0x88], expansion[2]);
            assert.deepEqual([0x09, 0xcf, 0x4f, 0x3c], expansion[3]);
        });

        it('should follow appendix A.1', function() {
            assert.deepEqual([0xa0, 0xfa, 0xfe, 0x17], expansion[4]);
            assert.deepEqual([0x88, 0x54, 0x2c, 0xb1], expansion[5]);
            assert.deepEqual([0x23, 0xa3, 0x39, 0x39], expansion[6]);
            assert.deepEqual([0x2a, 0x6c, 0x76, 0x05], expansion[7]);
            assert.deepEqual([0xf2, 0xc2, 0x95, 0xf2], expansion[8]);
        });

        it('should follow appendix A.1', function() {
            assert.deepEqual([0x57, 0x5c, 0x00, 0x6e], expansion[39]);
            assert.deepEqual([0xd0, 0x14, 0xf9, 0xa8], expansion[40]);
            assert.deepEqual([0xc9, 0xee, 0x25, 0x89], expansion[41]);
            assert.deepEqual([0xe1, 0x3f, 0x0c, 0xc8], expansion[42]);
            assert.deepEqual([0xb6, 0x63, 0x0c, 0xa6], expansion[43]);
        });
    });

    describe('addRoundKey', function() {
        it('should follow appendix B: example 1', function() {
            const key =  
                [
                    0x2b, 0x7e, 0x15, 0x16, 
                    0x28, 0xae, 0xd2, 0xa6, 
                    0xab, 0xf7, 0x15, 0x88, 
                    0x09, 0xcf, 0x4f, 0x3c,
                ]
            ;

            var w = keyExpansion(key);

            const input = 
                [
                    0x32, 0x88, 0x31, 0xe0,
                    0x43, 0x5a, 0x31, 0x37,
                    0xf6, 0x30, 0x98, 0x07,
                    0xa8, 0x8d, 0xa2, 0x34,
                ]
            ;

            const output =
                [
                    0x19, 0xa0, 0x9a, 0xe9,
                    0x3d, 0xf4, 0xc6, 0xf8,
                    0xe3, 0xe2, 0x8d, 0x48,
                    0xbe, 0x2b, 0x2a, 0x08,
                ]
            ;

            assert.deepEqual(output, addRoundKey(w, 0, input));
        });

        it('should follow appendix B: example 1', function() {
            const key =  
                [
                    0x2b, 0x7e, 0x15, 0x16, 
                    0x28, 0xae, 0xd2, 0xa6, 
                    0xab, 0xf7, 0x15, 0x88, 
                    0x09, 0xcf, 0x4f, 0x3c,
                ]
            ;

            var w = keyExpansion(key);

            const input = 
                [
                    0x04, 0xe0, 0x48, 0x28,
                    0x66, 0xcb, 0xf8, 0x06,
                    0x81, 0x19, 0xd3, 0x26,
                    0xe5, 0x9a, 0x7a, 0x4c, 
                ]
            ;

            const output =
                [
                    0xa4, 0x68, 0x6b, 0x02,
                    0x9c, 0x9f, 0x5b, 0x6a,
                    0x7f, 0x35, 0xea, 0x50,
                    0xf2, 0x2b, 0x43, 0x49,
                ]
            ;

            assert.deepEqual(output, addRoundKey(w, 1, input));
        });
    });

    describe('encrypt', function() {
         it('should follow appendix B: example 1', function() {
            const key =  
                [
                    0x2b, 0x7e, 0x15, 0x16, 
                    0x28, 0xae, 0xd2, 0xa6, 
                    0xab, 0xf7, 0x15, 0x88, 
                    0x09, 0xcf, 0x4f, 0x3c,
                ]
            ;

            const input = 
                [
                    0x32, 0x88, 0x31, 0xe0,
                    0x43, 0x5a, 0x31, 0x37,
                    0xf6, 0x30, 0x98, 0x07,
                    0xa8, 0x8d, 0xa2, 0x34,
                ]
            ;

            const output =
                [
                    0x39, 0x02, 0xdc, 0x19,
                    0x25, 0xdc, 0x11, 0x6a,
                    0x84, 0x09, 0x85, 0x0b,
                    0x1d, 0xfb, 0x97, 0x32,
                ]
            ;

            assert.deepEqual(output, encrypt(key, input));
        });

         it('should follow appendix C.1', function() {
            const key =  
                [
                    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e0f
 
                ]
            ;

            const input = 
                [
                    0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99, 0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff 
                ]
            ;

            const output =
                [
                    0x69, 0xc4, 0xe0, 0xd8, 0x6a, 0x7b, 0x04, 0x30, 0xd8, 0xcd, 0xb7, 0x80, 0x70, 0xb4, 0xc5, 0x5a
                ]
            ;

            assert.deepEqual(output, encrypt(key, input));
        });

        it('should follow appendix B: example 1', function() {
            const key =  
                [
                    0x2b, 0x7e, 0x15, 0x16,
                    0x28, 0xae, 0xd2, 0xa6,
                    0xab, 0xf7, 0x15, 0x88,
                    0x09, 0xcf, 0x4f, 0x3c,
                ]
            ;

            const input1 = 
                [
                    0x6b, 0xc1, 0xbe, 0xe2, 
                    0x2e, 0x40, 0x9f, 0x96, 
                    0xe9, 0x3d, 0x7e, 0x11, 
                    0x73, 0x93, 0x17, 0x2a,
                ]
            ;

            const output1 =
                [
                    0x3a, 0xd7, 0x7b, 0xb4, 
                    0x0d, 0x7a, 0x36, 0x60, 
                    0xa8, 0x9e, 0xca, 0xf3, 
                    0x24, 0x66, 0xef, 0x97,
                ]
            ;

            const input2 = 
                [
                    0xae, 0x2d, 0x8a, 0x57, 
                    0x1e, 0x03, 0xac, 0x9c,
                    0x9e, 0xb7, 0x6f, 0xac, 
                    0x45, 0xaf, 0x8e, 0x51,
                ]
            ;

            const output2 =
                [
                    0xf5, 0xd3, 0xd5, 0x85, 
                    0x03, 0xb9, 0x69, 0x9d, 
                    0xe7, 0x85, 0x89, 0x5a,
                    0x96, 0xfd, 0xba, 0xaf,
                ]
            ;

            const input3 = 
                [
                    0x30, 0xc8, 0x1c, 0x46, 
                    0xa3, 0x5c, 0xe4, 0x11, 
                    0xe5, 0xfb, 0xc1, 0x19, 
                    0x1a, 0x0a, 0x52, 0xef,
                ]
            ;

            const output3 =
                [
                    0x43, 0xb1, 0xcd, 0x7f, 
                    0x59, 0x8e, 0xce, 0x23, 
                    0x88, 0x1b, 0x00, 0xe3, 
                    0xed, 0x03, 0x06, 0x88,
                ]
            ;

            const input4 = 
                [
                    0xf6, 0x9f, 0x24, 0x45, 
                    0xdf, 0x4f, 0x9b, 0x17, 
                    0xad, 0x2b, 0x41, 0x7b, 
                    0xe6, 0x6c, 0x37, 0x10,
                ]
            ;

            const output4 =
                [
                    0x7b, 0x0c, 0x78, 0x5e, 
                    0x27, 0xe8, 0xad, 0x3f, 
                    0x82, 0x23, 0x20, 0x71,
                    0x04, 0x72, 0x5d, 0xd4,
                ]
            ;

            // assert.deepEqual(output1, encrypt(key, input1));
            // assert.deepEqual(output2, encrypt(key, input2));
            // assert.deepEqual(output3, encrypt(key, input3));
            // assert.deepEqual(output4, encrypt(key, input4));
        });
    });
});