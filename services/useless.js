const t = require('@babel/types')
const traverse = require('@babel/traverse').default
const generate = require('@babel/generator').default
const { getVarName } = require('./utils')

exports.delUseless = tree => {
  traverse(tree, {
    FunctionExpression(path) {
      if (path.node.body.body.length) {
        path.node.body.body.forEach(n => {
          let varName = getVarName(n)
          if (varName) {
            let count = 0
            path.traverse({
              Identifier(path){
                if(path.node.name===varName){
                  count++
                }
              }
            })
            if(count>1){
              
            }
          }
        })
      }
    },
  })
}
