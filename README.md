# :blue_car: Testla
Easy testing lib for Node.js from comments

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
