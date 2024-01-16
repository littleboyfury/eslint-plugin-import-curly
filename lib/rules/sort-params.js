'use strict'

const {getDefaultValues, getBracesTokens, reportFailedImport, sort} = require('../helper')

const PARAMS_SORT_TYPE_LOCATION = {
  FIRST: 'first',
  LAST: 'last',
  IGNORE: 'ignore',
}
const PARAMS_SORT_ORDER_BY = {
  ALPHABETICAL_ORDER: 'alphabeticalOrder',
  LETTER_NUMBER: 'letterNumber'
}
const PARAMS_SORT_SORT_BY = {
  DESC: 'desc',
  AEC: 'aec',
}

function handleFailedSortParams(context, node, importSpecifiers, options, messageId) {
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
    isFailedParamsOrder(importSpecifiers, options)
  ) {
    reportFailedImport(
      context,
      [bracesLeft.range[0], bracesRight.range[1]],
      messageId,
      fixFailedImportSortParams(importSpecifiers, sourceCode.getText(node), isHavaLastComma, options)
    )
  }
}

function getCheckPoint(node, options) {
  const result = {
    checkPoint: undefined,
    alphaCheckPoint: options.ignoreCase ? node.imported.name.toLowerCase() : node.imported.name,
  }
  switch (options.orderBy) {
    case PARAMS_SORT_ORDER_BY.ALPHABETICAL_ORDER:
      result.checkPoint = options.ignoreCase ? node.imported.name.toLowerCase() : node.imported.name
      return result
    case PARAMS_SORT_ORDER_BY.LETTER_NUMBER:
      result.checkPoint = node.imported.name.length
      return result
  }
}

function isFailedParamsOrder(nodes, options) {
  let lastCheckPoint = undefined
  let lastImportKind = undefined
  let lastAlphaCheckPoint = undefined

  for (const node of nodes) {
    const {checkPoint, alphaCheckPoint} = getCheckPoint(node, options)
    // js is undefined, ts type or value
    const {importKind} = node

    if (options.typeLocation !== PARAMS_SORT_TYPE_LOCATION.IGNORE) {
      let tempImportKing = importKind
      let tempLastImportKind = lastImportKind

      if (options.typeLocation === PARAMS_SORT_TYPE_LOCATION.LAST) {
        tempImportKing = lastImportKind
        tempLastImportKind = importKind
      }

      if (tempImportKing === 'type' && tempLastImportKind === 'value') {
        return true
      }

      if (tempImportKing === 'value' && tempLastImportKind === 'type') {
        lastCheckPoint = checkPoint
        lastImportKind = importKind
        lastAlphaCheckPoint = alphaCheckPoint
        continue
      }
    }

    if (lastCheckPoint) {
      let tempCheckPoint = checkPoint
      let tempLastCheckPoint = lastCheckPoint
      let tempAlphaCheckPoint = alphaCheckPoint
      let tempLastAlphaCheckPoint = lastAlphaCheckPoint

      if (options.sortBy === PARAMS_SORT_SORT_BY.DESC) {
        tempCheckPoint = lastCheckPoint
        tempLastCheckPoint = checkPoint
        tempAlphaCheckPoint = lastAlphaCheckPoint
        tempLastAlphaCheckPoint = alphaCheckPoint
      }

      if (tempLastCheckPoint > tempCheckPoint) {
        return true
      }

      if (
        options.orderBy === PARAMS_SORT_ORDER_BY.LETTER_NUMBER &&
        tempLastCheckPoint === tempCheckPoint &&
        tempLastAlphaCheckPoint &&
        tempLastAlphaCheckPoint > tempAlphaCheckPoint
      ) {
        return true
      }
    }


    lastCheckPoint = checkPoint
    lastImportKind = importKind
    lastAlphaCheckPoint = alphaCheckPoint
  }

  return false
}

function fixFailedImportSortParams(nodes, codeStr, isHavaLastComma, options) {
  const params = codeStr.substring(codeStr.indexOf('{') + 1, codeStr.indexOf('}'))
    .split(',')
  let lastItem = ''
  if (isHavaLastComma) {
    lastItem = params.pop()
  }
  const nodeOriginIndexMap = new Map()
  nodes.forEach((v, i) => {
    nodeOriginIndexMap.set(v, i)
  })
  const sortFn = (a, b) => {
    const {
      checkPoint: aCheckPoint,
      alphaCheckPoint: aAlphaCheckPoint
    } = getCheckPoint(a, options)
    const {
      checkPoint: bCheckPoint,
      alphaCheckPoint: bAlphaCheckPoint
    } = getCheckPoint(b, options)

    if (options.orderBy === PARAMS_SORT_ORDER_BY.LETTER_NUMBER) {
      // letter number is equal, sort by alpha
      return options.sortBy === PARAMS_SORT_SORT_BY.AEC ?
        (aCheckPoint === bCheckPoint ? aAlphaCheckPoint > bAlphaCheckPoint : aCheckPoint > bCheckPoint) :
        (aCheckPoint === bCheckPoint ? aAlphaCheckPoint < bAlphaCheckPoint : aCheckPoint < bCheckPoint)
    }
    return options.sortBy === PARAMS_SORT_SORT_BY.AEC ? aCheckPoint > bCheckPoint : aCheckPoint < bCheckPoint
  }

  const fixArr = []
  let sortedNodes

  if (options.typeLocation === 'ignore') {
    sortedNodes = sort(nodes, sortFn)
  } else {
    const sortedTypeNodes = sort(nodes.filter(v => v.importKind === 'type'), sortFn)
    // js importKind is undefined, ts is type or value
    const sortedValueNodes = sort(nodes.filter(v => (v.importKind === 'value' || v.importKind === undefined)), sortFn)

    if (options.typeLocation !== PARAMS_SORT_TYPE_LOCATION.LAST) {
      sortedNodes = [...sortedTypeNodes, ...sortedValueNodes]
    } else {
      sortedNodes = [...sortedValueNodes, ...sortedTypeNodes]
    }
  }

  sortedNodes.forEach(v => {
    fixArr.push(params[nodeOriginIndexMap.get(v)])
  })
  if (isHavaLastComma) {
    fixArr.push(lastItem)
  }
  return `{${fixArr.join(',')}}`
}

module.exports = {
  meta: {
    type: 'layout',
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          typeLocation: {
            type: 'string',
            enum: Object.values(PARAMS_SORT_TYPE_LOCATION)
          },
          orderBy: {
            type: 'string',
            enum: Object.values(PARAMS_SORT_ORDER_BY)
          },
          sortBy: {
            type: 'string',
            enum: Object.values(PARAMS_SORT_SORT_BY)
          },
          ignoreCase: {
            type: 'boolean'
          }
        },
        additionalProperties: false,
      },
    ],
    docs: {
      url: 'https://github.com/littleboyfury/eslint-plugin-import-curly?tab=readme-ov-file#usage',
    },
    messages: {
      'import-sort-params': 'Run autofix to import sort params!',
    },
  },
  create: (context) => {
    const options = getDefaultValues({...context.options[0]}, {
      typeLocation: 'ignore',
      orderBy: 'alphabeticalOrder',
      sortBy: 'aec',
      ignoreCase: true,
    })

    return {
      ImportDeclaration: node => {
        const importSpecifiers = node.specifiers.filter(v => v.type === 'ImportSpecifier')
        handleFailedSortParams(context, node, importSpecifiers, options, 'import-sort-params')
      },
    }
  }
}



