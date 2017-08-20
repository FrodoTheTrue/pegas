module.exports = {
    extends: 'airbnb/base',
    env: {
        'node': true
    },
    rules: {
        'indent': ['error', 4],
        'no-underscore-dangle': 0,
        'no-plusplus': ['error', { 'allowForLoopAfterthoughts': true }],
        'no-param-reassign': 0,
        'no-continue': 0,
        'consistent-return': 0,
        'class-methods-use-this': 0
    }
}
