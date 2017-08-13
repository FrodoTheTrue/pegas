const Testla = require('../../src/testla.js');

describe('_correctBrackets', () => {
    it('should return true if no brackets in string', () => {
        assert.isTrue(Testla._correctBrackets('abc'));
    });
});
