module.exports= function example(a,b) {
  if (a == null || b == null) {
    return false
  }

  var c = void 0;
  {
    //comment1
    c = {};
  }

  function testit(){
    return a.foo === b.foo
  }

  function unused(){
    //comment-unusedcode
    var aa = {foo: 1}
    var bb = {foo: 2}
    return aa.foo + bb.foo
  }

  return (
    //comment2
    testit()
  )

  //comment-deadcode
  var d = 100;
  //now return
  return d
}