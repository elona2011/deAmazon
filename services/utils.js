/**
 *
 */
exports.getVarName = node => {
  if (node.type === 'VariableDeclaration' && node.declarations.length === 1) {
    return node.declarations[0].id.name
  }
}
