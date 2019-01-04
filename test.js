const terser = require('terser')
const fs = require('fs')
const path = require('path')
const util = require('util')
const assert = require('assert')
const fsunlink = util.promisify(fs.unlink)


describe("when not keeping comments", function(){

  before(function(){
    return fsunlink("./sample1new-retainnone.js")
    .catch(err=>{
      //ignore error. we expect this if the files don't already exit.
      //I know a bit lame, but a low priorty for this project.
    })
  })

  it("should created useable code when building a fully minified file", function(){
    let sample1 = fs.readFileSync(__dirname+path.sep+"sample1.js").toString()

    let result = terser.minify( sample1,{
          output: { comments: false }
        , compress: true

    })

    if(result.error) throw new Error(result.error)
    fs.writeFileSync("./sample1new-retainnone.js",result.code)
    let sample1new = require('./sample1new-retainnone')

    assert.strictEqual(sample1new(), false)

    assert.strictEqual(sample1new({foo:"same"}, {foo:"same"}), true )
    assert.strictEqual(sample1new({foo:"same"}, {foo:"notsame"}), false)
    assert( ! result.code.includes("//"), "shouldn't have comments")
  })

})

describe("when keeping comments", function(){
  before(function(){
    return fsunlink("./sample1-retaindead.js")
    .then( () =>{
      return fsunlink("./sample1new-retainunused.js")
    })
    .then( () =>{
      return fsunlink("./sample1new-retainboth.js")
    })
    .then( () =>{
      return fsunlink("./sample1new-notcompressed.js")
    })
    .catch(err=>{
      //ignore
    })
  })

  it("should created useable code when retaining deadcode", function(){
    let sample1 = fs.readFileSync(__dirname+path.sep+"sample1.js").toString()

    let result = terser.minify( sample1,{
          output: { comments: 'all'}
        , compress: { unused:true, dead_code: false, global_defs: {"process.env.NODE_ENV": "production"} }

    })

    if(result.error) throw new Error(result.error)
    fs.writeFileSync("./sample1new-retaindead.js",result.code)
    let sample1new = require('./sample1new-retaindead')

    assert.strictEqual(sample1new(), false)

    assert.strictEqual(sample1new({foo:"same"}, {foo:"same"}), true )
    assert.strictEqual(sample1new({foo:"same"}, {foo:"notsame"}), false)

    assert(result.code.includes("//comment-deadcode"), "missing deadcode comment")

  })

  it("should created useable code when retaining unused code", function(){
    let sample1 = fs.readFileSync(__dirname+path.sep+"sample1.js").toString()

    let result = terser.minify( sample1,{
          output: { comments: 'all'}
        , compress: { unused:false, dead_code: true, global_defs: {"process.env.NODE_ENV": "production"} }

    })

    if(result.error) throw new Error(result.error)
    fs.writeFileSync("./sample1new-retainunused.js",result.code)
    let sample1new = require('./sample1new-retainunused')

    assert.strictEqual(sample1new(), false)

    assert.strictEqual(sample1new({foo:"same"}, {foo:"same"}), true )
    assert.strictEqual(sample1new({foo:"same"}, {foo:"notsame"}), false)
    assert(result.code.includes("//comment-unusedcode"), "missing unused code comment")
  })

  it("should created useable code with all comments, when retaining unused code and deadcode", function(){
    let sample1 = fs.readFileSync(__dirname+path.sep+"sample1.js").toString()

    let result = terser.minify( sample1,{
          output: { comments: 'all'}
        , compress: { unused:false, dead_code: false, global_defs: {"process.env.NODE_ENV": "production"} }

    })

    if(result.error) throw new Error(result.error)
    fs.writeFileSync("./sample1new-retainboth.js",result.code)
    let sample1new = require('./sample1new-retainboth')

    assert.strictEqual(sample1new(), false)

    assert.strictEqual(sample1new({foo:"same"}, {foo:"same"}), true )
    assert.strictEqual(sample1new({foo:"same"}, {foo:"notsame"}), false)

    assert(result.code.includes("//comment1"), "missing comment1")
    assert(result.code.includes("//comment2"), "missing comment2")
    assert(result.code.includes("//comment-deadcode"), "missing deadcode comment")
    assert(result.code.includes("//comment-unusedcode"), "missing unused code comment")

  })



  it.only("should created useable code when not compressing", function(){
    let sample1 = fs.readFileSync(__dirname+path.sep+"sample1.js").toString()

    let result = terser.minify( sample1,{
          output: { comments: 'all'}
        , compress: false
    })

    if(result.error) throw new Error(result.error)
    fs.writeFileSync("./sample1new-notcompressed.js",result.code)
    let sample1new = require('./sample1new-notcompressed')

    assert.strictEqual(sample1new(), false)

    assert.strictEqual(sample1new({foo:"same"}, {foo:"same"}), true )
    assert.strictEqual(sample1new({foo:"same"}, {foo:"notsame"}), false)
    assert(result.code.includes("//comment1"), "missing comment1")
    assert(result.code.includes("//comment2"), "missing comment2")
    assert(result.code.includes("//comment-deadcode"), "missing deadcode comment")
    assert(result.code.includes("//comment-unusedcode"), "missing unused code comment")

  })

})