'use strict'

const allRules = require('../lib')
const {RuleTester} = require('eslint')

const sortParamsRule = allRules.rules['sort-params']
const message = sortParamsRule.meta.messages['import-sort-params']
const baseTests = {
  valid: [
    `import {a,b,c,d} from 'a'`,
    `import {AA,B,C,D} from 'a'`,
    `import {a,BB,c,D} from 'a'`,
    `import {A,b,CC,d} from 'a'`,
    `import {A,b,c,DD} from 'a'`,
    `import {aaa,B,C,d} from 'a'`,
    `import {a,bbb,c,default as e} from 'a'`,
    {
      code: `
import {aa,bb,cc,dd} from 'a'
import {B,C,DD, AAA} from 'a'
import {a,c,D, BB} from 'a'
import {AAAA,bbbb,dddd,CCCCC} from 'a'
import {AA,bbb,cCC,DDDD} from 'a'
import {Bb,CC,ddd,aaaa} from 'a'
import {ab,cce,bbbbb, default as eeee,} from 'a'
      `,
      options: [{typeLocation: 'last', orderBy: 'letterNumber',}]
    },
    {
      code: `
import {d,c,b,a} from 'a'
import {D,C,B,AA,} from 'a'
import {DD,cc,BB,aAA} from 'a'
import {dd,CC,bb,A,} from 'a'
import {DDD,ccc,bB,Aa,} from 'a'
import {ddd,CCC,BBb,aaa,} from 'a'
import {default as e,cC,bbb,aA} from 'a'
      `,
      options: [{sortBy: 'desc'}]
    },
    {
      code: `
import {d,c,b,a} from 'a'
import {D,C,B,AA,} from 'a'
import {cc,aAA,DD,BB,} from 'a'
import {dd,bb,CC,A,} from 'a'
import {ccc,bB,DDD,Aa,} from 'a'
import {ddd,aaa,CCC,BBb,} from 'a'
import {default as e,bbb,aA,CCCa} from 'a'
      `,
      options: [{sortBy: 'desc', ignoreCase: false}]
    }
  ],
  invalid: [
    {
      code: `import {A,C,B} from 'C'`,
      output: `import {A,B,C} from 'C'`,
      errors: [{message}],
    },
    {
      code: `import {a,d,b,c} from 'a'`,
      output: `import {a,b,c,d} from 'a'`,
      errors: [{message}],
    },
    {
      code: `import {B,aaa,C,d} from 'a'`,
      output: `import {aaa,B,C,d} from 'a'`,
      errors: [{message}],
    },
    {
      code: `import {a,default as e,bbb,c} from 'a'`,
      output: `import {a,bbb,c,default as e} from 'a'`,
      errors: [{message}],
    },
    {
      code: `import {cce, default as eeee,bbbbb,ab,} from 'a'`,
      output: `import {ab,cce,bbbbb, default as eeee,} from 'a'`,
      errors: [{message}],
      options: [{typeLocation: 'last', orderBy: 'letterNumber',}]
    },
    {
      code: `import {cC,aA,default as e,bbb} from 'a'`,
      output: `import {default as e,cC,bbb,aA} from 'a'`,
      errors: [{message}],
      options: [{sortBy: 'desc'}]
    },
    {
      code: `import {CCCa,default as e,aA,bbb} from 'a'`,
      output: `import {default as e,bbb,aA,CCCa} from 'a'`,
      errors: [{message}],
      options: [{sortBy: 'desc', ignoreCase: false}]
    },
  ]
}
const tsTests = {
  valid: [
    `import type {aaa,b,c,d} from 'a'`,
    `import {A,BB,C,D} from 'a'`,
    `import type {a,B,cCC,D} from 'a'`,
    `import {A,b,c,D} from 'a'`,
    `import {AAA,b,Ca,d} from 'a'`,
    `import {a,BB,C,d} from 'a'`,
    `import {type a,bbb,type c,d} from 'a'`,
    `import {a,type b,type c,d} from 'a'`,
    `import {type A,B,type cd,d} from 'a'`,
    `import {A,type B,type c,d} from 'a'`,
    `import {a,type bb,c,type d} from 'a'`,
    `import {type a,b,cccc,type d} from 'a'`,
    `import {baa,type bba,C,type D} from 'a'`,
    `import {type a,b,C,type D} from 'a'`,
    `import {a,b,cc,default as d} from 'a'`,
    `import {a,type b,c,default as d} from 'a'`,
    {
      code: `import { \nAA, \ntype B, C, \naaa } from 'C'`,
      options: [{typeLocation: 'ignore', orderBy: 'alphabeticalOrder', sortBy: 'aec', ignoreCase: false}],
    },
    `import {A, type B as BB, C} from 'C'`,
    `import 'A'`,
    `import type A from 'C'`,
    `import * as A from 'C'`,
    `import {  a,  b,  default as A,  e} from './test1.js'`,
    `import {\n  type A as AA,\n  B\n} from 'C'\nimport type A, {\n  AA as AAA,\n  B as BB,\n  type C,\n} from 'D'`,
    {
      code: `import { \ntype BB, aa, \naaa, \nbbb } from 'C'`,
      options: [{typeLocation: 'ignore', orderBy: 'letterNumber', sortBy: 'aec', ignoreCase: false}],
    },
    {
      code: `
import type {aaa,b,c,d} from 'a'
import {A,BB,C,D} from 'a'
import type {a,B,cCC,D} from 'a'
import {A,b,c,D} from 'a'
import {AAA,b,Ca,d} from 'a'
import {a,BB,C,d} from 'a'
import {type a,type c, bbb,d} from 'a'
import {type b,type c,a, d} from 'a'
import {type A,type cd,B, d} from 'a'
import {type B,type c,A, d} from 'a'
import {type bb,type d,a,c} from 'a'
import {type a,type d,bbb,ccc} from 'a'
import {type b, a,c,default as d} from 'a'
`,
      options: [{typeLocation: 'first'}]
    },
    {
      code: `
import type {aaa,b,c,d} from 'a'
import {A,BB,C,D} from 'a'
import type {a,B,cCC,D} from 'a'
import {A,b,c,D} from 'a'
import {AAA,b,Ca,d} from 'a'
import {a,BB,C,d} from 'a'
import {bbb,d,type a,type c,} from 'a'
import {a,d,type b,type c} from 'a'
import {B,d,type A,type cd,} from 'a'
import {a,c,default as d, type b} from 'a'
      `,
      options: [{typeLocation: 'last'}]
    },
    {
      code: `
import type {b,c,d, aaa} from 'a'
import {A,C,D,BB} from 'a'
import type {a,B,D,cCC} from 'a'
import {A,b,c,D} from 'a'
import {b,d,Ca,AAA} from 'a'
import {d,bbb,type a,type c,} from 'a'
import {a,d,type b,type c} from 'a'
import {B,d,type A,type cd,} from 'a'
import {a,c,default as d, type b} from 'a'
      `,
      options: [{typeLocation: 'last', orderBy: 'letterNumber'}]
    },
    {
      code: `
import type {d,c,b,aaa,} from 'a'
import {D,C,BB,A,} from 'a'
import type {D,cCC,B,a} from 'a'
import {D,c,b,A} from 'a'
import {d,Ca,b,AAA,} from 'a'
import {d,C,BB,a} from 'a'
import {type c,type a, d, bbb} from 'a'
import {type c,type b,d, a} from 'a'
import {type cd,type A,d, B,} from 'a'
import {type c,type B,d, A} from 'a'
import {type d,type bb,c,a} from 'a'
import {type d,type a,ccc,bbb} from 'a'
import {type b, default as d, c, a} from 'a'
      `,
      options: [{typeLocation: 'first', sortBy: 'desc'}]
    }
  ],
  invalid: [
    {
      code: `import { aaa, \ntype BB, \naa, \nbbb } from 'C'`,
      output: `import { \naa, \ntype BB, aaa, \nbbb } from 'C'`,
      errors: [{message}],
      options: [{typeLocation: 'ignore', orderBy: 'letterNumber', sortBy: 'aec', ignoreCase: true}],
    },
    {
      code: `import {type A,type cd,d,B} from 'a'`,
      output: `import {type A,B,type cd,d} from 'a'`,
      errors: [{message}],
    },
    {
      code: `import {c,default as d,type b,a} from 'a'`,
      output: `import {a,type b,c,default as d} from 'a'`,
      errors: [{message}],
    },
    {
      code: `import {c,a,default as d,type b} from 'a'`,
      output: `import {type b,a,c,default as d} from 'a'`,
      errors: [{message}],
      options: [{typeLocation: 'first'}]
    },
    {
      code: `import {type b,c,default as d,a,} from 'a'`,
      output: `import {a,c,default as d,type b,} from 'a'`,
      errors: [{message}],
      options: [{typeLocation: 'last'}]
    },
    {
      code: `import {type b,c,a,default as d,} from 'a'`,
      output: `import {a,c,default as d,type b,} from 'a'`,
      errors: [{message}],
      options: [{typeLocation: 'last', orderBy: 'letterNumber'}]
    },
    {
      code: `import {d,type A,type cd,B,} from 'a'`,
      output: `import {B,d,type A,type cd,} from 'a'`,
      errors: [{message}],
      options: [{typeLocation: 'last', orderBy: 'letterNumber'}]
    },
    {
      code: `import {d,type cd,type Aa,B,} from 'a'`,
      output: `import {B,d,type Aa,type cd,} from 'a'`,
      errors: [{message}],
      options: [{typeLocation: 'last', orderBy: 'letterNumber'}]
    },
    {
      code: `import {d,type cd,type A,B,} from 'a'`,
      output: `import {d,B,type cd,type A,} from 'a'`,
      errors: [{message}],
      options: [{typeLocation: 'last', orderBy: 'letterNumber', sortBy: 'desc'}]
    },
    {
      code: `import { a,type b, default as d, c} from 'a'`,
      output: `import {type b, default as d, c, a} from 'a'`,
      errors: [{message}],
      options: [{typeLocation: 'first', sortBy: 'desc'}]
    },
  ]
}

const baseTester = new RuleTester({
  parserOptions: {ecmaVersion: 2020, sourceType: 'module'},
})
baseTester.run('bast-test', sortParamsRule, baseTests)

const tsTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {sourceType: 'module'},
})
tsTester.run('typescript-base-test', sortParamsRule, baseTests)
tsTester.run('typescript-ts-test', sortParamsRule, tsTests)

baseTester.run('test', sortParamsRule, {
  valid: [`import a from 'a'`],
  invalid: [
    {
      code: `import {cce, default as eeee,bbbbb,ab,} from 'a'`,
      output: `import {ab,cce,bbbbb, default as eeee,} from 'a'`,
      errors: [{message}],
      options: [{typeLocation: 'last', orderBy: 'letterNumber',}]
    }
  ]
})
