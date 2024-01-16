'use strict'

function getBracesTokens(tokens) {
  let bracesLeft
  let bracesRight
  let isHavaLastComma = false
  tokens.forEach((v, i) => {
    if (v.type === 'Punctuator' && v.value === '{') {
      bracesLeft = v
    }
    if (v.type === 'Punctuator' && v.value === '}') {
      if (i > 0 && tokens[i - 1].value === ',') {
        isHavaLastComma = true
      }
      bracesRight = v
    }
  })
  return {
    bracesLeft,
    bracesRight,
    isHavaLastComma,
  }
}

function reportFailedImport(context, ranges, messageId, fixedCode) {
  const sourceCode = context.getSourceCode()

  context.report({
    messageId,
    loc: {
      start: sourceCode.getLocFromIndex(ranges[0]),
      end: sourceCode.getLocFromIndex(ranges[1])
    },
    fix: fixer => fixer.replaceTextRange(ranges, fixedCode)
  })
}

function getDefaultValues(options, defaultValues) {
  for (const key of Object.keys(defaultValues)) {
    if (options[key] === undefined) {
      options[key] = defaultValues[key]
    }
  }
  return options
}

function sort(arr, fn) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (fn(arr[j], arr[j + 1])) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
      }
    }
  }
  return arr
}

module.exports = {
  getDefaultValues,
  getBracesTokens,
  sort,
  reportFailedImport
}
