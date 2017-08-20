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

module.exports.summ = summ;
module.exports.mull = mull;
module.exports.objective = objective;
module.exports.reverseArray = reverseArray;
