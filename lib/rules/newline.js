'use strict'

const { getDefaultValues, getBracesTokens, reportFailedImport} = require('../helper')

function handleFailedImport(context, node, importSpecifiers, messageId) {
  const sourceCode = context.getSourceCode()

  const {
    bracesLeft,
    bracesRight,
    isHavaLastComma
  } = getBracesTokens(sourceCode.getTokens(node))

  if (
    bracesLeft &&
    bracesRight &&
    importSpecifiers &&
    isImportNewline(importSpecifiers, bracesLeft.loc.start.line, bracesRight.loc.start.line)
  ) {
    reportFailedImport(
      context,
      [bracesLeft.range[0], bracesRight.range[1]],
      messageId,
      fixFailedImportCurlyNewline(sourceCode.getText(node), isHavaLastComma)
    )
  }
}

function isImportNewline(nodes, bracesLeftLine, bracesRightLine) {
  let lastNodeLine = bracesLeftLine
  for (const node of nodes) {
    // 'A \nas AA' is not allow
    if (node.loc.start.line !== node.loc.end.line) {
      return true
    }
    // 'A as AA, B' or '{A' is not allow
    if (lastNodeLine === node.loc.start.line) {
      return true
    } else {
      lastNodeLine = node.loc.start.line
    }
  }
  // 'B}' is not allow
  return nodes[nodes.length - 1].loc.start.line === bracesRightLine
}

function fixFailedImportCurlyNewline(codeStr, isHavaLastComma) {
  const params = codeStr.substring(codeStr.indexOf('{') + 1, codeStr.indexOf('}'))
    .replace(/\n/g, '')
    .split(',')
    .filter(v => v.trim())
    .map(v => `  ${v.trim()}`)

  if (isHavaLastComma) {
    params.push('')
  }

  return `{\n${params.join(',\n')}${isHavaLastComma ? '}' : '\n}'}`
}

module.exports = {
  meta: {
    type: 'layout',
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          count: {
            type: 'number',
          },
        },
        additionalProperties: false,
      },
    ],
    docs: {
      url: 'https://github.com/littleboyfury/eslint-plugin-import-curly?tab=readme-ov-file#usage',
    },
    // schema: [],
    messages: {
      'import-curly-newline': 'Run autofix to import curly newline!',
    },
  },
  create: (context) => {
    const option = getDefaultValues({ ...context.options[0] }, { count: 3 })

    return {
      ImportDeclaration: node => {
        const importSpecifiers = node.specifiers.filter(v => v.type === 'ImportSpecifier')
        if (!(importSpecifiers.length && option.count)) {
          return
        }
        if (importSpecifiers.length < option.count) {
          return
        }
        handleFailedImport(context, node, importSpecifiers, 'import-curly-newline')
      },
    }
  }
}

