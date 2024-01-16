'use strict'

const allRules = require('../lib')
const {RuleTester} = require('eslint')

const importCurlyNewlineRule = allRules.rules.newline
const message = importCurlyNewlineRule.meta.messages["import-curly-newline"]
const baseTests = {
  valid: [
    {
      code: `import { default as CC, \nA as AA,B} from 'C'`,
      options: [{count: 4}]
    },
    {
      code: `import {\nA as AA,B} from 'C'`,
    },
    `import A from 'C'`,
    `import * as A from 'C'`,
    `import {\r\n  A as AA,\r\n  B\r\n} from 'C'\nimport A, {\r\n  AA as AAA,\r\n  B as BB,\r\n  C,\r\n} from 'D'`,
    `import {\n  A as AA,\n  B,\n} from 'C'`,
    `import A, {\n  AA as AAA,\n  B as BB,\n  C,\n} from 'D'`
  ],
  invalid: [
    {
      code: `import {\nA as AA,B} from 'C'`,
      output: `import {\n  A as AA,\n  B\n} from 'C'`,
      errors: [{message}],
      options: [{count: 1}]
    },
    {
      code: `import {\nA as AA,B} from 'C'`,
      output: `import {\n  A as AA,\n  B\n} from 'C'`,
      errors: [{message}],
      options: [{count: 2}]
    },
    {
      code: `import {A \nas AA,B} from 'C'`,
      output: `import {\n  A as AA,\n  B\n} from 'C'`,
      errors: [{message}],
      options: [{count: 2}]
    },
    {
      code: `import {\nA as AA,\nB} from 'C'`,
      output: `import {\n  A as AA,\n  B\n} from 'C'`,
      errors: [{message}],
      options: [{count: 2}]
    },
    {
      code: `import {\nA as AA,\nB,} from 'C'`,
      output: `import {\n  A as AA,\n  B,\n} from 'C'`,
      errors: [{message}],
      options: [{count: 2}]
    },
  ]
}
const tsTests = {
  valid: [
    `import 'A'`,
    `import type A from 'C'`,
    `import * as A from 'C'`,
    `import {\n  type A as AA,\n  B\n} from 'C'\nimport type A, {\n  AA as AAA,\n  B as BB,\n  type C,\n} from 'D'`,
    `import {\n  A as AA,\n  type B,\n} from 'C'`,
    `import A, {\n  AA as AAA,\n  B as BB,\n  C,\n} from 'D'`,
    `import type {\n  AA as AAA,\n  B as BB,\n  C,\n} from 'D'`
  ],
  invalid: [
    {
      code: `import {\ntype \nA \nas AA,B} from 'C'`,
      output: `import {\n  type A as AA,\n  B\n} from 'C'`,
      errors: [{message}],
      options: [{count: 2}]
    },
    {
      code: `import type {A \ras AA,B} from 'C'`,
      output: `import type {\r  A as AA,\r  B\r} from 'C'`,
      errors: [{message}],
      options: [{count: 2}]
    },
    {
      code: `import {\nA as AA,\nB} from 'C'`,
      output: `import {\n  A as AA,\n  B\n} from 'C'`,
      errors: [{message}],
      options: [{count: 2}]
    },
    {
      code: `import {\r\ntype \r\nA \r\nas \r\nAA,\r\ntype B,} from 'C'`,
      output: `import {\r\n  type A as AA,\r\n  type B,\r\n} from 'C'`,
      errors: [{message}],
      options: [{count: 2}]
    },
    {
      code: `import {A,B} from 'C'\nimport {\n  A_A,\n  B_B,\n  C_C, D_D,\n  E_E,\n  F_F,\n  G_G,\n} from '@/uti/cc'`,
      output: `import {A,B} from 'C'\nimport {\n  A_A,\n  B_B,\n  C_C,\n  D_D,\n  E_E,\n  F_F,\n  G_G,\n} from '@/uti/cc'`,
      errors: [{message}],
    },
  ]
}

const baseTester = new RuleTester({
  parserOptions: {ecmaVersion: 2020, sourceType: "module"},
})
baseTester.run('bast-test', importCurlyNewlineRule, baseTests)

const tsTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {sourceType: "module"},
})
tsTester.run('typescript-base-test', importCurlyNewlineRule, baseTests)
tsTester.run('typescript-ts-test', importCurlyNewlineRule, tsTests)


