const Promise = require('bluebird');
/*T
  (2, 2) => 4
  (4, 3) => 8
*/
function summ(a, b) {
    return a + b;
}

/*T
  (2, 2) => 4
  (4, 3) => 12
*/
function mull(a, b) {
    return a * b;
}

/*T
  ({a: 1, b: 1}) => { a: 1, b: 1 }
*/
function objective(obj) {
  return obj;
}

/*T
  ([1, 2, 3]) => [3, 2, 1]
*/
function reverseArray(arr) {
  return arr.reverse();
}

/*T
  ExportAs: renameExportExample
  ('b') => 'abc'
*/
function exportExample(str) {
  return 'a' + str + 'c';
}

/*T
  (6, cb) => cb({ result: 'ok' }, 6)
*/
function asyncExample(param, cb) {
  setTimeout(() => {
    cb({ result: 'ok' }, param);
  }, 0);
}

/*T
  () => 'example'
*/
function withoutArgs() {
  return 'example';
}

/*T
  () => 'text'
*/
async function asyncAwait() {
  await Promise.fromNode(cb => setTimeout(cb, 0));
  return 'text';
}

/*T
  (5) => 6
  (0) => Error
*/
function errorFunction(arg) {
  if (arg === 0) {
    throw new Error();
  }

  return arg += 1;
}

module.exports.summ = summ;
module.exports.mull = mull;
module.exports.objective = objective;
module.exports.reverseArray = reverseArray;
module.exports.renameExportExample = exportExample;
module.exports.asyncExample = asyncExample;
module.exports.withoutArgs = withoutArgs;
module.exports.asyncAwait = asyncAwait;
module.exports.errorFunction = errorFunction;
