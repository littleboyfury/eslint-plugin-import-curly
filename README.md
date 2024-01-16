eslint-plugin-import-curly

import curly

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-import-curly`:

```sh
npm install eslint-plugin-import-curly --save-dev
```

## Usage


Add `import-curly` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": ["import-curly"]
}
```

### RULE import-curly/newline

options

| name  | type   | default | description                                          |
|-------|--------|---------|------------------------------------------------------|
| count | number | 3       | If it exceeds count, each attribute will be wrapped. |

```json
{
  "rules": {
    "import-curly/newline": [
      "error",
      {
        "count": 4
      }
    ]
  }
}
```

valid

```javascript
import A from 'C'
import * as A from 'C'
// count defalut 3
import {A, B} from 'C'
import {
  A as AA,
  B
} from 'C'
import A, {
  AA as AAA,
  B as BB,
  C,
} from 'D'
import {
  A as AA,
  B,
} from 'C'
import A, {
  AA as AAA,
  B as BB,
  C,
} from 'D'
```
invalid

```javascript
// invalid
import {
  A as AA,B, C} from 'C'

// ||
// \/

// valid
import {
  A as AA,
  B,
  C
} from 'C'

// invalid
import {
  A as AA,B, 
  C,
} from 'C'

// ||
// \/

// valid, Commas will be preserved
import {
  A as AA,
  B,
  C,
} from 'C'
```
### RULE import-curly/sort-params

options

| name         | type    | default           | enum                           | description                                                                                                                                          |
|--------------|---------|-------------------|--------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| typeLocation | string  | ignore            | ignore,first,last              | ignore: ignore 'type' location, first: 'type' is at the front, last: 'type' is at the end                                                            |
| orderBy      | string  | alphabeticalOrder | alphabeticalOrder,letterNumber | alphabeticalOrder: order by alpha, letterNumber: order by letter number. when order by letterNumber, if the letterNumber is the same, order by alpha |
| sortBy       | string  | aec               | aec,desc                       | aec: sort in ascending order, desc: sort in descending order                                                                                         |
| ignoreCase   | boolean | true              |                                | true: ignore case, false: don't ignore case                                                                                                          |

```json
{
  "rules": {
    "import-curly/sort-params": "error",
    "import-curly/sort-params": [
      "error",
      {
        "typeLocation": "first",
        "orderBy": "letterNumber",
        "sortBy": "desc",
        "ignoreCase": false
      }
    ]
  }
}
```

#### default options
```json
{
  "rules": {
    "import-curly/sort-params": "error",
    "import-curly/sort-params": [
      "error",
      {
        "typeLocation": "ignore",
        "orderBy": "alphabeticalOrder",
        "sortBy": "aec",
        "ignoreCase": true
      }
    ]
  }
}
```

valid

```typescript
import type {a,b,c,d} from 'a'
import {A,B,C,D} from 'a'
import type {a,B,c,D} from 'a'
import {A,b,c,D} from 'a'
import {type a,b,type c,d} from 'a'
import {a,type b,c,default as d} from 'a'
```

invalid
```typescript
// invalid
import {type A,type c,d,B} from 'a'
// ||
// \/
// valid
import {type A,B,type c,d} from 'a'


// invalid, ignore type, compare with 'default'
import {c,default as d,type b,a} from 'a'
// ||
// \/
// valid
import {a,type b,c,default as d} from 'a'
```

#### typeLocation first

```json
{
  "rules": {
    "import-curly/sort-params": [
      "error",
      {
        "typeLocation": "first"
      }
    ],
    "import-curly/sort-params": [
      "error",
      {
        "typeLocation": "ignore",
        "orderBy": "alphabeticalOrder",
        "sortBy": "aec",
        "ignoreCase": true
      }
    ]
  }
}
```

valid
```typescript
// type first
import {type B,type c,A, d} from 'a'
import {type b,type d,a,c} from 'a'
```

invalid
```typescript
// invalid, compare with 'default'
import {c,a,default as d,type b} from 'a'
// ||
// \/
// valid
import {type b,a,c,default as d} from 'a'
```

#### orderBy letterNumber

```json
{
  "rules": {
    "import-curly/sort-params": [
      "error",
      {
        "orderBy": "letterNumber"
      }
    ],
    "import-curly/sort-params": [
      "error",
      {
        "typeLocation": "ignore",
        "orderBy": "letterNumber",
        "sortBy": "aec",
        "ignoreCase": true
      }
    ]
  }
}
```

valid
```typescript
import {a, ba, bb, ccc} from 'a'
import {a, ba, bb, bbb} from 'a'
```

invalid
```typescript
// invalid bb ba letterNumber is the same, should order by alpha
import {a, bb, ba} from 'a'
// ||
// \/
// valid
import {a, ba, bb} from 'a'
```

#### orderBy alphabeticalOrder and sortBy desc

```json
{
  "rules": {
    "import-curly/sort-params": [
      "error",
      {
        "sortBy": "desc"
      }
    ],
    "import-curly/sort-params": [
      "error",
      {
        "typeLocation": "ignore",
        "orderBy": "alphabeticalOrder",
        "sortBy": "desc",
        "ignoreCase": true
      }
    ]
  }
}
```

valid
```typescript
import {d, c, b, a} from 'a'
```

#### orderBy letterNumber and sortBy desc

```json
{
  "rules": {
    "import-curly/sort-params": [
      "error",
      {
        "orderBy": "letterNumber",
        "sortBy": "desc"
      }
    ],
    "import-curly/sort-params": [
      "error",
      {
        "typeLocation": "ignore",
        "orderBy": "letterNumber",
        "sortBy": "desc",
        "ignoreCase": true
      }
    ]
  }
}
```

valid
```typescript
import {aaa, cc, aa, d} from 'a'
```

#### ignoreCase false

```json
{
  "rules": {
    "import-curly/sort-params": [
      "error",
      {
        "ignoreCase": false
      }
    ],
    "import-curly/sort-params": [
      "error",
      {
        "typeLocation": "ignore",
        "orderBy": "alphabeticalOrder",
        "sortBy": "aec",
        "ignoreCase": false
      }
    ]
  }
}
```

valid
```typescript
import {A, B, C, a, b, c} from 'a'
import {A, B, C, a, b, c, default as d} from 'a'
```
