const logger = rewire('../src/logger');

describe('logger', () => {
    describe('log', () => {
        it('should call coreLog with log params', () => {
            const coreLogSpy = sinon.spy();

            logger.__set__('_coreLog', coreLogSpy);
            logger.log('testMessage', { config: 'config' });

            assert.isOk(coreLogSpy.calledWith('testMessage', { config: 'config' }, false));
        });
    });

    describe('logLine', () => {
        it('should call coreLog with logLine params', () => {
            const coreLogSpy = sinon.spy();

            logger.__set__('_coreLog', coreLogSpy);
            logger.logLine('testMessage', { config: 'config' });

            assert.isOk(coreLogSpy.calledWith('testMessage', { config: 'config' }, true));
        });
    });

    describe('_coreLog', () => {
        it('should simple write message with empty config', () => {
            const write = sinon.spy();
            const logger = proxyquire('../src/logger', {
                process: {
                    stdout: {
                        write,
                    },
                },
            });

            logger._coreLog('testMessage', undefined, false);

            assert.isOk(write.calledWith('testMessage'));
        });

        it('should add endline', () => {
            const write = sinon.spy();
            const logger = proxyquire('../src/logger', {
                process: {
                    stdout: {
                        write,
                    },
                },
            });

            logger._coreLog('testMessage', undefined, true);

            assert.isOk(write.calledWith('testMessage\n'));
        });

        it('should add color', () => {
            const write = sinon.spy();
            const logger = proxyquire('../src/logger', {
                process: {
                    stdout: {
                        write,
                    },
                },
            });

            logger._coreLog('testMessage', {
                color: 'green',
            }, false);

            assert.isOk(write.calledWith('\x1b[32mtestMessage\x1b[0m'));
        });

        it('should add spaces before', () => {
            const write = sinon.spy();
            const logger = proxyquire('../src/logger', {
                process: {
                    stdout: {
                        write,
                    },
                },
            });

            logger._coreLog('testMessage', {
                spacesBefore: 5,
            }, false);

            assert.isOk(write.calledWith('     testMessage'));
        });

        it('should add spaces after', () => {
            const write = sinon.spy();
            const logger = proxyquire('../src/logger', {
                process: {
                    stdout: {
                        write,
                    },
                },
            });

            logger._coreLog('testMessage', {
                spacesAfter: 5,
            }, false);

            assert.isOk(write.calledWith('testMessage     '));
        });
    });
});
