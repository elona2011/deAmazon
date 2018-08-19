const { parse } = require('@babel/parser')
const { readFileSync, writeFileSync } = require('fs')
const path = require('path')
const generate = require('@babel/generator').default
const traverse = require('@babel/traverse').default
const { memberToString, concatStr } = require('./services/str')
const { delUseless } = require('./services/useless')

let ajs = readFileSync(path.resolve(__dirname, 'a.js'), 'utf8')
let ajsTree = parse(ajs)

traverse(ajsTree, {
  StringLiteral(path) {
    // console.log('b:', path.node.value)
    // let s = path.node.value.replace(/\\|"/, function(m) {
    //   return '\\' + m
    // })
    // let a = '"' + s + '"'
    // console.log('a:', a)
    // path.node.value = eval(a)
    path.node.value = '1' + path.node.value
  },
})

let ajsNew = generate(ajsTree, {}).code

let ajsTree1 = parse(ajsNew)

traverse(ajsTree1, {
  StringLiteral(path) {
    // console.log('b:', path.node.value)
    // let s = path.node.value.replace(/\\|"/, function(m) {
    //   return '\\' + m
    // })
    // let a = '"' + s + '"'
    // console.log('a:', a)
    // path.node.value = eval(a)
    path.node.value = path.node.value.slice(1)
  },
})

memberToString(ajsTree1, ['_o0oO0'])
concatStr(ajsTree1)
delUseless(ajsTree1)

let ajsNew1 = generate(ajsTree1, {}).code

writeFileSync(path.resolve(__dirname, 'b.js'), ajsNew1)
