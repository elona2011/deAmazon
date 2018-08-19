const t = require('@babel/types')
const traverse = require('@babel/traverse').default
const generate = require('@babel/generator').default

exports.memberToString = (tree, strArr) => {
  traverse(tree, {
    FunctionExpression(path) {
      if (path.node.body.body.length) {
        let varDec = path.node.body.body[0],
          varName,
          varValue
        if (
          varDec.type === 'VariableDeclaration' &&
          varDec.declarations.length === 1 &&
          varDec.declarations[0].type === 'VariableDeclarator' &&
          varDec.declarations[0].init.type === 'ArrayExpression' &&
          varDec.declarations[0].init.elements.length > 1
        ) {
          varName = varDec.declarations[0].id.name
          let c = generate(varDec.declarations[0].init).code
          varValue = eval(c)
        }
        if (varName) {
          replaceMember(path, varName, varValue)

          //校验是否完全替换，然后删除原变量名
          let count = 0
          path.traverse({
            MemberExpression(path) {
              if (path.node.object.name === varName) count++
            },
          })
          if (count === 0) {
            path.traverse({
              VariableDeclaration(path) {
                if (
                  path.node.declarations.length === 1 &&
                  path.node.declarations[0].type === 'VariableDeclarator' &&
                  path.node.declarations[0].id.name === varName
                ) {
                  path.remove()
                }
              },
            })
          } else {
            console.log(varName, count)
          }
        }
      }
    },
  })
}

const replaceMember = (path, name, valueArr) => {
  path.traverse({
    MemberExpression(path) {
      if (path.node.object.name === name) {
        let i = path.node.property.value
        switch (typeof valueArr[i]) {
          case 'string':
            path.replaceWith(t.stringLiteral(valueArr[i]))
            break
          case 'boolean':
            path.replaceWith(t.booleanLiteral(valueArr[i]))
            break
          case 'number':
            path.replaceWith(t.numericLiteral(valueArr[i]))
            break
          case 'object':
            if (valueArr[i] === null) {
              path.replaceWith(t.nullLiteral())
            }
            break

          default:
            break
        }
      }
    },
  })
}

/**
 * 合并字符串
 */
exports.concatStr = tree => {
  let doConcat = true
  while (doConcat) {
    doConcat = false
    traverse(tree, {
      BinaryExpression(path) {
        if (path.node.left.type === 'StringLiteral' && path.node.right.type === 'StringLiteral') {
          doConcat = true
          path.replaceWith(t.stringLiteral(path.node.left.value + path.node.right.value))
        }
      },
    })
  }
}
