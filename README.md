# terser-comment-retainment-tests
lightweight project to test some behaviors around generating code with comments retained.

## to use
    npm install
    npm test

### as of terser 3.14.1 this will produce the following result

![current test results](https://github.com/mike-coolfront/terser-comment-retainment-tests/blob/master/test-results.png)

![showing some issues when retaining comments and unused code](https://github.com/mike-coolfront/terser-comment-retainment-tests/blob/master/retainunused.png)

![showing some issues when retaining comments and both dead and unused code](https://github.com/mike-coolfront/terser-comment-retainment-tests/blob/master/retainboth.png)

![showing some issues when retaining comments and compress=false ](https://github.com/mike-coolfront/terser-comment-retainment-tests/blob/master/notcompressed.png)
