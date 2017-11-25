# :white_check_mark: :x: Pegas [![Build Status](https://travis-ci.org/FrodoTheTrue/testla.svg?branch=master)](https://travis-ci.org/FrodoTheTrue/testla) [![codecov](https://codecov.io/gh/FrodoTheTrue/testla/branch/master/graph/badge.svg)](https://codecov.io/gh/FrodoTheTrue/testla) [![Join the chat at https://gitter.im/testla-talks/Lobby](https://badges.gitter.im/testla-talks/Lobby.svg)](https://gitter.im/testla-talks/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
Write tests in JS comments! (inspired by JSDoc)
## Description
Pegas - simple testing framework for Node.js platfrom. It allows to write tests for functions in comments to this function (yea, like in JSDoc) in simple format. This library firstly done for small scripts, you no need more files to test your app and you can take tests, docs and code in one moment.
## Usage
1) Install Pegas:
```
npm install pegas --save-dev
```
2) Write Pegas-tests in block comment before function that you want to test:
```js
// example.js

/*P
  (2, 2) => 4
  (4, 3) => 7
*/
function summ(a, b) {
    return a + b;
}

/*P
  (2, 2) => 4
  (4, 3) => 12
*/
function mull(a, b) {
    return a * b;
}

/*P
  ({a: 1, b: 1}) => { a: 1, b: 1 }
*/
function objective(obj) {
  return obj;
}

/*P
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
// config.testcom.js

{
  'test': [
    '.examples/example.js'
  ]
}

```
4) Run tests:
```
pegas config.pegas.js
```
![Result](https://image.ibb.co/ijtCma/Screen_Shot_2017_08_15_at_23_55_04.png)

More examples [here](https://github.com/FrodoTheTrue/pegas/tree/master/examples)

## Features

1) Change export naming

```js
  /*P
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
  /*P
    (2000, cb) => cb(null, { result: true })
  */
  function asyncFunc(fuckingParam, callback) {
    // ... async magic ...
    callback(null, { result: true });
  }
```

3) Test async/await functions:
```js
  /*P
    () => 'text'
  */
  async function asyncAwait() {
    await Promise.fromNode(cb => setTimeout(cb, 0));
    return 'text';
  }
```


4) Test errors:
```js
  /*P
    () => Error
  */
  function returnError() {
    throw new Error();
  }
```
