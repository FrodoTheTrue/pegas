const process = require('process');

const CONSOLE_COLOR = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    default: '\x1b[0m',
};

function _coreLog(text, config, isEndLine) {
    let result = '';
    const endSymbol = isEndLine ? '\n' : '';

    if (!config) {
        process.stdout.write(text + endSymbol);
        return;
    }

    const color = CONSOLE_COLOR[config.color];

    if (color) {
        result += color;
    }

    if (config.spacesBefore) {
        result += ' '.repeat(config.spacesBefore);
    }

    result += text;

    if (config.spacesAfter) {
        result += ' '.repeat(config.spacesAfter);
    }

    if (color) {
        result += CONSOLE_COLOR.default; // return default color
    }
    process.stdout.write(result + endSymbol);
}

/**
 * Log to console with params and without endline
 *
 * @param {String} text - string to console
 * @param {PrintConfig} config
 */
function log(text, config) {
    _coreLog(text, config, false);
}

/**
 * Log to console with params with endline
 *
 * @param {String} text - string to console
 * @param {PrintConfig} config
 */
function logLine(text, config) {
    _coreLog(text, config, true);
}

module.exports = {
    log,
    logLine,
    _coreLog,
};

/**
 * Logger config
 *
 * @typedef {Object} PrintConfig
 *
 * @property {String} color - ['green', 'red'] - console text color
 * @property {Number} spacesBefore - number of spaces before the text
 * @property {Number} spacesAfter - number of spaces after the text
 */
