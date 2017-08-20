const path = require('path');
const utils = require('../../src/utils');

describe('utils', () => {
    describe('correctBrackets', () => {
        it('should return true if no brackets in string', () => {
            assert.isTrue(utils.correctBrackets('abc'));
        });

        it('should return false if incorrect brackets order', () => {
            assert.isFalse(utils.correctBrackets('[(])'));
        });

        it('should return false if extra open bracket', () => {
            assert.isFalse(utils.correctBrackets('[]('));
        });

        it('should return false if extra close bracket', () => {
            assert.isFalse(utils.correctBrackets('[])'));
        });

        it('should return true if correct brackets order', () => {
            assert.isTrue(utils.correctBrackets('[]()[{()}()]'));
        });
    });

    describe('createVars', () => {
        it('should not change vars if they are correct', () => {
            const vars = ['1', '2', '{ a: 1, b: 2 }', '[1, 2, 3]'];
            const resultVars = [1, 2, { a: 1, b: 2 }, [1, 2, 3]];

            assert.deepEqual(utils.createVars(vars), resultVars);
        });

        it('should combine vars', () => {
            const vars = ['{ a: 1', 'b: 2 }', '1', '[ 1', '2 ]'];
            const resultVars = [{ a: 1, b: 2 }, 1, [1, 2]];

            assert.deepEqual(utils.createVars(vars), resultVars);
        });

        it('should throw error if variables are incorrect', () => {
            const vars = ['{ a: 1', 'b: 2'];

            assert.throws(() => utils.createVars(vars), 'Incorrect variables in test');
        });
    });

    describe('validateConfig', () => {
        it('should throw error if config not consist "test" field', () => {
            const config = {
                path: '/dir',
            };

            assert.throws(() => utils.validateConfig(config), '"test" is required in config file');
        });

        it('should not throw error if config is ok', () => {
            const config = {
                test: '/dir',
            };

            assert.doesNotThrow(() => utils.validateConfig(config), Error);
        });
    });

    describe('getFilesDeeply', () => {
        it('should return correct paths list', () => {
            const files = [
                path.resolve(__dirname, '../mocks/mockDirs/dir/file2.txt'),
                path.resolve(__dirname, '../mocks/mockDirs/file1.txt'),
            ];
            assert.deepEqual(utils.getFilesDeeply(path.resolve(__dirname, '../mocks/mockDirs')), files);
        });
    });
});
