const fs = require('fs');
const ppath = require('path');
const esprima = require('esprima');
const assert = require('chai').assert;
const utils = require('./utils');
const logger = require('./logger');
const json5 = require('json5');

const FUNCTION_ALLOWED_TYPES = [
    'FunctionDeclaration',
    'FunctionExpression',
    'ArrowFunctionExpression',
];
const COMMENT_ALLOWED_TYPES = [
    'Block',
];

/** Parsing logic for Testla comments */
class Testla {
    constructor(configPath) {
        this._configPath = configPath;
        this._testlaConfig = require(this._configPath); // eslint-disable-line
    }

    /**
     * Returns only comments, that Testla can parse
     *
     * @param {Object[]} comments - comments
     *
     * @returns {Object[]}
     */
    _filterTestlaComments(comments) {
        return comments.filter(comment => !COMMENT_ALLOWED_TYPES.indexOf(comment.type));
    }

    /**
     * Returns only comments, that Testla can parse
     *
     * @param {EsprimaData} esprimaData - parsed js object
     *
     * @returns {Object[]}
     */
    _sortFunctionsAndComments(esprimaData) {
        const result = [];

        esprimaData.body.forEach((functionData) => {
            if (!FUNCTION_ALLOWED_TYPES.indexOf(functionData.type)) {
                result.push({
                    type: 'function',
                    name: functionData.id.name,
                    position: functionData.loc.start,
                });
            }
        });

        this._filterTestlaComments(esprimaData.comments).forEach((comment) => {
            result.push({
                type: 'tcomment',
                value: comment.value,
                position: comment.loc.start,
            });
        });

        result.sort((a, b) => {
            if (a.position.line === b.position.line) {
                return a.position.column - b.position.column;
            }

            return a.position.line - b.position.line;
        });

        return result;
    }

    _getPathsFromConfigs() {
        let resultPaths = [];

        utils.validateConfig(this._testlaConfig);

        this._testlaConfig.test.forEach((path) => {
            path = ppath.resolve(this._configPath, '../', path);
            resultPaths = [...new Set([...resultPaths, ...utils.getFilesDeeply(path)])];
        });

        return resultPaths;
    }

    _printOk(result) {
        logger.log('OK:', {
            color: 'green',
            spacesBefore: 7,
            spacesAfter: 5,
        });
        logger.logLine(result);
    }

    _printError(result, expected) {
        logger.log('FAILED:', {
            color: 'red',
            spacesBefore: 7,
            spacesAfter: 1,
        });
        logger.logLine(`${result
        } (expected: ${json5.stringify(expected)})`);
    }

    /**
     * Run tests and log result to console
     *
     * @param {String[]} paths - files withs Testla comments
     */
    _runTests(paths) {
        let file;
        let esprimaData;
        let esprimaSortedData;
        let comments;

        paths.forEach((path) => {
            file = fs.readFileSync(path, 'utf-8');

            if (!file.includes('/*T')) {
                return false;
            }

            esprimaData = esprima.parseScript(file, { comment: true, loc: true });
            esprimaSortedData = this._sortFunctionsAndComments(esprimaData);
            comments = this._filterTestlaComments(esprimaData.comments);

            logger.logLine(`File: ${path}`);

            comments.forEach((comment) => {
                const commentData = comment.value.split('\n');

                if (commentData[0] !== 'T') {
                    return false;
                }

                let indexComment;
                for (let i = 0; i < esprimaSortedData.length; i++) {
                    if (esprimaSortedData[i].value &&
                        esprimaSortedData[i].value === comment.value) {
                        indexComment = i;
                    }
                }

                let funcName;
                for (let i = indexComment; i < esprimaSortedData.length; i++) {
                    if (esprimaSortedData[i].name) {
                        funcName = esprimaSortedData[i].name;
                        break;
                    }
                }

                if (!funcName) {
                    throw new Error('Testla comment has no function');
                }

                logger.log('function', {
                    spacesBefore: 3,
                    spacesAfter: 1,
                });
                logger.logLine(funcName);

                const exportOption = commentData[1].trim();
                if (exportOption.startsWith('ExportAs: ')) {
                    funcName = exportOption.split('ExportAs: ')[1];
                }
                const testFunc = require(ppath.resolve(path)); //eslint-disable-line

                for (let i = 1; i < commentData.length; i++) {
                    if (!commentData[i]) continue;
                    commentData[i] = commentData[i].trim();

                    if (commentData[i][0] !== '(') continue;

                    let [vars, result] = commentData[i].split('=>');
                    vars = vars.match(/\(([^)]+)\)/)[1].split(',');

                    vars = utils.createVars(vars);
                    result = utils.createVars([result])[0];

                    try {
                        assert.deepEqual(testFunc[funcName](...vars), result);

                        this._printOk(commentData[i]);
                    } catch (err) {
                        this._printError(commentData[i], testFunc[funcName](...vars));
                    }
                }
            });
        });
    }

    runTests() {
        const paths = this._getPathsFromConfigs();
        this._runTests(paths);
    }
}

module.exports = Testla;
