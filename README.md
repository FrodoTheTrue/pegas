# :white_check_mark: :red_circle: Testla
Write tests in JS comments! Run it easy! :relaxed: :neckbeard: :ok_hand: :cop:
## Description
Testla - simple testing framework for Node.js platfrom. It allows to write tests to functions in comments to this function (yea, like in JSDoc) in simple format. This library first done for small scripts, you no need more files to test your app (except config maybe) and you can take tests and docs in one moment.
## Advantages
- You can write tests near with code
## TODO
- [ ] Mock variables in tests
- [ ] Write comment to test in T-test
- [ ] Functions as params
- [ ] Catch error's
- [ ] Async functions
- [ ] Promises
- [ ] Async/Await
## Usage
1) Install Testla:
```
npm install testla --save-dev
```
2) Write tests in comments:
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
  /**T
    (2, 2) => 4
    (-1, 1) => 0
  */
  function summ(a, b) {
    return a + b;
  }
```
2) In config file told path to files that you want
3) Mock variables and functions:
```js
  /**T
    (1, 1) => 7
      Mocks:
        c = 5
    (3, 3) => 10
  */
  function summ(a, b) {
    var c = 4;
    return a + b + c;
  }
```
4) Test async functions
```js
  /**T
    (2000, cb) => cb(null, { result: true }) // check variables in callback
  */
  function asyncFunc(paramWait, callback) {
    setTimeout(callback, paramWait);
  }
```
