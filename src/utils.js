const fs = require('fs');
const json5 = require('json5');

/**
 * Returns list of files in directory recursively
 *
 * @param {String} directory - path to directory
 *
 * @returns {String[]}
 */
function getFilesDeeply(directory) {
    let results = [];
    const list = fs.readdirSync(directory);

    list.forEach((file) => {
        const fileDir = `${directory}/${file}`;
        const stat = fs.statSync(fileDir);

        if (stat && stat.isDirectory()) {
            results = results.concat(getFilesDeeply(fileDir));
        } else {
            results.push(fileDir);
        }
    });

    return results;
}

function validateConfig(config) {
    if (!config.test) {
        throw new Error('"test" is required in config file');
    }
}

function correctBrackets(str) {
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

function createVars(vars) {
    const result = [];

    for (let i = 0; i < vars.length; i++) {
        if (correctBrackets(vars[i])) {
            result.push(vars[i]);
        } else if (i + 1 < vars.length) {
            vars[i + 1] = `${vars[i]},${vars[i + 1]}`;
        } else {
            throw Error('Incorrect variables in test');
        }
    }
    return result.map(v => json5.parse(v));
}

module.exports = {
    getFilesDeeply,
    validateConfig,
    correctBrackets,
    createVars,
};
