# :white_check_mark: :x: Testla [![Build Status](https://travis-ci.org/FrodoTheTrue/testla.svg?branch=master)](https://travis-ci.org/FrodoTheTrue/testla) [![codecov](https://codecov.io/gh/FrodoTheTrue/testla/branch/master/graph/badge.svg)](https://codecov.io/gh/FrodoTheTrue/testla) [![Join the chat at https://gitter.im/testla-talks/Lobby](https://badges.gitter.im/testla-talks/Lobby.svg)](https://gitter.im/testla-talks/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
Write tests in JS comments! (inspired by JSDoc)
## Description
Testla - simple testing framework for Node.js platfrom (later maybe for client). It allows to write tests to functions in comments to this function (yea, like in JSDoc) in simple format. This library first done for small scripts, you no need more files to test your app and you can take tests and docs in one moment.
## Usage
1) Install Testla:
```
npm install testla --save-dev
```
2) Write Testla-tests in block comment before function that you want to test:
```js
// example.js

/*T
  (2, 2) => 4
  (4, 3) => 7
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
```

3) Create simple config:
```js
// config.testla.js

{
  'test': [
    '.examples/example.js'
  ]
}

```
4) Run tests:
```
testla config.testla.js
```
![Result](https://image.ibb.co/ijtCma/Screen_Shot_2017_08_15_at_23_55_04.png)

More examples [here](https://github.com/FrodoTheTrue/testla/tree/master/examples)

## Features

1) Change export naming

```js
  /*T
    ExportAs: fakeSumm
    (2, 2) => 4
    (-1, 1) => 0
  */
  function summ(a, b) {
    return a + b;
  }
  
  ...
  
  module.exports.fakeSumm = summ;
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

3) Test async/await functions:
```js
  /*T
    () => 'text'
  */
  async function asyncAwait() {
    await Promise.fromNode(cb => setTimeout(cb, 0));
    return 'text';
  }
```


4) Test errors:
```js
  /*T
    () => Error
  */
  function returnError() {
    throw new Error();
  }
```
