const path = require('path');
const Testla = require('../../src/testla');

describe('testla', () => {
    describe('_filterTestlaComments', () => {
        it('should return only Testla comments', () => {
            const t = new Testla(path.resolve(__dirname, '../mocks/testla.config'));
            const comments = [
                {
                    type: 'Block',
                    value: 'Testla comment',
                },
                {
                    type: 'Inline',
                    value: 'No Testla comment',
                },
            ];

            assert.deepEqual(t._filterTestlaComments(comments), [
                {
                    type: 'Block',
                    value: 'Testla comment',
                },
            ],
            );
        });
    });

    describe('_sortFunctionsAndComments', () => {
        it('should return array', () => {
            const t = new Testla(path.resolve(__dirname, '../mocks/testla.config'));
            const esprimaData = {
                type: 'Program',
                body: [
                    {
                        id: {
                            type: 'Identifier',
                            name: 'mull',
                        },
                        type: 'FunctionDeclaration',
                        loc: {
                            start: {
                                line: 1,
                                column: 1,
                            },
                            end: {
                                line: 1,
                                column: 5,
                            },
                        },
                    },
                ],
                comments: [{
                    type: 'Block',
                    value: 'T\n  (2, 2) => 4\n  (4, 3) => 8\n',
                    loc: {
                        start: {
                            line: 2,
                            column: 1,
                        },
                        end: {
                            line: 2,
                            column: 5,
                        },
                    },
                }],
            };
            const result = t._sortFunctionsAndComments(esprimaData);

            assert.isArray(result);
        });

        it('should push only allowed function data', () => {
            const t = new Testla(path.resolve(__dirname, '../mocks/testla.config'));
            const esprimaData = {
                type: 'Program',
                body: [
                    {
                        id: {
                            type: 'Identifier',
                            name: 'mull',
                        },
                        type: 'FunctionDeclaration',
                        loc: {
                            start: {
                                line: 1,
                                column: 1,
                            },
                            end: {
                                line: 1,
                                column: 5,
                            },
                        },
                    },
                    {
                        id: {
                            type: 'Identifier',
                            name: 'summ',
                        },
                        type: 'NotTestlaFunction',
                        loc: {
                            start: {
                                line: 2,
                                column: 1,
                            },
                            end: {
                                line: 2,
                                column: 5,
                            },
                        },
                    },
                ],
                comments: [],
            };
            const result = t._sortFunctionsAndComments(esprimaData);

            assert.lengthOf(result, 1);
            assert.strictEqual(result[0].name, 'mull');
            assert.strictEqual(result[0].type, 'function');
        });

        it('should push only Testla comments data', () => {
            const t = new Testla(path.resolve(__dirname, '../mocks/testla.config'));
            const esprimaData = {
                type: 'Program',
                body: [],
                comments: [{
                    type: 'Block',
                    value: 'TestlaValue',
                    loc: {
                        start: {
                            line: 2,
                            column: 1,
                        },
                        end: {
                            line: 2,
                            column: 5,
                        },
                    },
                },
                {
                    type: 'Line',
                    value: 'NonTestlaValue',
                    loc: {
                        start: {
                            line: 3,
                            column: 1,
                        },
                        end: {
                            line: 3,
                            column: 5,
                        },
                    },
                }],
            };
            const result = t._sortFunctionsAndComments(esprimaData);

            assert.lengthOf(result, 1);
            assert.strictEqual(result[0].value, 'TestlaValue');
            assert.strictEqual(result[0].type, 'tcomment');
        });

        it('should sort functions and comments', () => {
            const t = new Testla(path.resolve(__dirname, '../mocks/testla.config'));
            const esprimaData = {
                type: 'Program',
                body: [
                    {
                        id: {
                            type: 'Identifier',
                            name: 'mull',
                        },
                        type: 'FunctionDeclaration',
                        loc: {
                            start: {
                                line: 1,
                                column: 1,
                            },
                            end: {
                                line: 1,
                                column: 5,
                            },
                        },
                    },
                    {
                        id: {
                            type: 'Identifier',
                            name: 'summ',
                        },
                        type: 'FunctionDeclaration',
                        loc: {
                            start: {
                                line: 10,
                                column: 1,
                            },
                            end: {
                                line: 10,
                                column: 5,
                            },
                        },
                    },
                ],
                comments: [{
                    type: 'Block',
                    value: 'TestlaValue',
                    loc: {
                        start: {
                            line: 1,
                            column: 6,
                        },
                        end: {
                            line: 1,
                            column: 10,
                        },
                    },
                },
                {
                    type: 'Block',
                    value: 'AnotherTestlaValue',
                    loc: {
                        start: {
                            line: 20,
                            column: 1,
                        },
                        end: {
                            line: 20,
                            column: 5,
                        },
                    },
                }],
            };
            const result = t._sortFunctionsAndComments(esprimaData);

            assert.lengthOf(result, 4);
            assert.strictEqual(result[0].name, 'mull');
            assert.strictEqual(result[1].value, 'TestlaValue');
            assert.strictEqual(result[2].name, 'summ');
            assert.strictEqual(result[3].value, 'AnotherTestlaValue');
        });
    });

    describe('_getPathsFromConfig', () => {
        it('should return combined paths', () => {
            const result = [
                path.resolve(__dirname, '../mocks/tests/test.js'),
                path.resolve(__dirname, '../mocks/tests2/testFile.js'),
                path.resolve(__dirname, '../mocks/tests2/tests3/testFile2.js'),
            ];
            const t = new Testla(path.resolve(__dirname, '../mocks/testla2.config'));

            assert.deepEqual(t._getPathsFromConfigs(), result);
        });
    });

    describe('_printOk', () => {
        it('should call logger with correct params', () => {
            const spyLog = sinon.spy();
            const spyLogLine = sinon.spy();
            const Testla = proxyquire('../src/testla', {
                './logger': {
                    log: spyLog,
                    logLine: spyLogLine,
                },
            });
            const t = new Testla(path.resolve(__dirname, '../mocks/testla.config'));

            t._printOk('testMessage');

            assert.isOk(spyLog.calledWith('OK:', {
                color: 'green',
                spacesBefore: 7,
                spacesAfter: 5,
            }));

            assert.isOk(spyLogLine.calledWith('testMessage'));
        });
    });

    describe('_printError', () => {
        it('should call logger with correct params', () => {
            const spyLog = sinon.spy();
            const spyLogLine = sinon.spy();
            const Testla = proxyquire('../src/testla', {
                './logger': {
                    log: spyLog,
                    logLine: spyLogLine,
                },
            });
            const t = new Testla(path.resolve(__dirname, '../mocks/testla.config'));

            t._printError('testMessage', { error: true });

            assert.isOk(spyLog.calledWith('FAILED:', {
                color: 'red',
                spacesBefore: 7,
                spacesAfter: 1,
            }));

            assert.isOk(spyLogLine.calledWith('testMessage (expected: {error:true})'));
        });
    });

    describe('runTests', () => {
        it('should run tests', () => {
            const t = new Testla(path.resolve(__dirname, '../mocks/testla.config'));

            assert.doesNotThrow(() => t.runTests());
        });
    });
});
