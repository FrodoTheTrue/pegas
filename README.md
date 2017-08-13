# :white_check_mark: :red_circle: Testla
Write tests in JS comments!
## Description
Testla - simple testing framework for Node.js platfrom. It allows to write tests to functions in comments to this function (yea, like in JSDoc) in simple format. This library first done for small scripts, you no need more files to test your app (except config maybe) and you can take tests and docs in one moment.
## Usage
1) Install Testla:
```
npm install testla --save-dev
```
2) Write Testla-tests in block comment before function that you want to test:
```js
// logic.js

/**T
  (2, 2) => 4
  (3, 3) => 6
*/
function summ(a, b) {
  return a + b;
}

module.exports.summ = summ;
```
3) Create simple config:
```js
// config.testla.js

{
  'test': [
    '.../logic.js'
  ]
}

```
4) Run tests:
```
testla config.testla.js
```
## Examples
TODO

Idea:
1) WriteTests in comments like JSDoc
```js
  /*T
    (2, 2) => 4
    (-1, 1) => 0
  */
  function summ(a, b) {
    return a + b;
  }
```
2) Test async functions
```js
  /*T
    (2000, cb) => cb(null, { result: true }) // check variables in callback
  */
  function asyncFunc(fuckingParam, callback) {
    // ... async magic ...
    callback(null, { result: true });
  }
```
3) Mock variables and functions:
```js
  /*T
    (1, 1) => 7
    (3, 3) => 10 { mocks: { c : 5 }}
  */
  function summ(a, b) {
    var c = 4;
    return a + b + c;
  }
```
3) Test async/await functions:
```js
  /*T
    () => 'fuck'
  */
  async function fuck() {
    return await getFuck(); // getFuck return promise, that return string 'fuck;
  }
```
4) Test promises
```
Coming soon
```
5) Time tests
```
Coming soon
```
