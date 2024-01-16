"use strict";

const newline = require('./rules/newline')
const sortParams = require('./rules/sort-params')

module.exports.rules = {
  newline,
  'sort-params': sortParams
}
