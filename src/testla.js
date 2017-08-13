const fs = require('fs');
const ppath = require('path');
const esprima = require('esprima');
const json5 = require('json5');
const assert = require('chai').assert;

/** Parsing logic for Testla comments */
class Testla {
    constructor(configPath) {
        this._configPath = configPath;
        this._testlaConfig = require(this._configPath); // eslint-disable-line
        this._FUNCTION_ALLOWED_TYPES = [
            'FunctionDeclaration',
            'FunctionExpression',
            'ArrowFunctionExpression',
        ];
        this._COMMENT_ALLOWED_TYPES = [
            'Block',
        ];
    }

    /**
     * Returns list of files in directory recursively
     *
     * @param {String} directory - path to directory
     *
     * @returns {String[]}
     */
    _getFilesDeeply(directory) {
        let results = [];
        const list = fs.readdirSync(directory);

        list.forEach((file) => {
            const fileDir = `${directory}/${file}`;
            const stat = fs.statSync(fileDir);

            if (stat && stat.isDirectory()) {
                results = results.concat(this._getFilesDeeply(fileDir));
            } else {
                results.push(fileDir);
            }
        });

        return results;
    }

    /**
     * Returns only comments, that Testla can parse
     *
     * @param {Object[]} comments - comments
     *
     * @returns {Object[]}
     */
    _filterTestlaComments(comments) {
        return comments.filter(comment => !this._COMMENT_ALLOWED_TYPES.indexOf(comment.type));
    }

    _sortFunctionsAndComments(esprimaData) {
        const result = [];

        esprimaData.body.forEach((functionData) => {
            if (!this._FUNCTION_ALLOWED_TYPES.indexOf(functionData.type)) {
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

    static _validateConfig(config) {
        if (!config.test) {
            throw new Error('"test" is required in config file');
        }
    }

    _getPathsFromConfigs(config) {
        let resultPaths = [];

        Testla._validateConfig(this._testlaConfig);

        config.test.forEach((path) => {
            path = ppath.resolve(this._configPath, '../', path);
            resultPaths = [...new Set([...resultPaths, ...this._getFilesDeeply(path)])];
        });

        return resultPaths;
    }

    static _correctBrackets(str) {
        const brackets = {
            '[': ']',
            '{': '}',
            '(': ')',
        };
        const closeBrackets = Object.values(brackets);
        const stack = [];

        for (let i = 0; i < str.length; i++) {
            if (brackets[str[i]]) {
                stack.push(str[i]);
            }

            if (closeBrackets.includes(str[i])) {
                if (stack.length === 0) {
                    return false;
                }

                if (brackets[stack.pop()] !== str[i]) {
                    return false;
                }
            }
        }

        if (stack.length > 0) {
            return false;
        }

        return true;
    }

    static _createVars(vars) {
        const result = [];

        for (let i = 0; i < vars.length; i++) {
            if (Testla._correctBrackets(vars[i])) {
                result.push(vars[i]);
            } else if (i + 1 < vars.length) {
                vars[i + 1] = `${vars[i]},${vars[i + 1]}`;
            } else {
                throw Error('Incorrect variables in test');
            }
        }
        return result;
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

            console.log(`File: ${path}`); // eslint-disable-line no-console

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

                console.log('   function', funcName); // eslint-disable-line no-console

                const testFunc = require(ppath.resolve(path)); //eslint-disable-line
                for (let i = 1; i < commentData.length; i++) {
                    if (!commentData[i]) continue;
                    let [vars, result] = commentData[i].split('=>');
                    vars = vars.match(/\(([^)]+)\)/)[1].split(',');
                    vars = Testla._createVars(vars);
                    vars = vars.map(v => json5.parse(v));
                    result = json5.parse(result);

                    try {
                        assert.deepEqual(testFunc[funcName](...vars), result);
                    } catch (err) {
                        // eslint-disable-next-line no-console
                        console.log('\x1b[31m', '       FAILED: ', '\x1b[0m',
                            commentData[i],
                            `(expected: ${JSON.stringify(testFunc[funcName](...vars))})`);
                    }
                    // eslint-disable-next-line no-console
                    console.log('\x1b[32m', '       OK: ', '\x1b[0m', commentData[i]);
                }
            });
        });
    }

    runTests() {
        const paths = this._getPathsFromConfigs(this._testlaConfig);
        this._runTests(paths);
    }
}

module.exports = Testla;
