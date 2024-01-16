'use strict'

const fs = require('fs')
const fse = require('fs-extra')
const { join } = require('path')

const buildDir = join(__dirname, 'build')

if (fs.existsSync(buildDir)) {
  fs.rmdirSync(buildDir, {recursive: true})
}
fs.mkdirSync(buildDir)

const packageJSON = JSON.parse(fs.readFileSync('./package.json', 'utf8'))
packageJSON.devDependencies = {}

fse.copySync('./lib', join(buildDir, 'lib'))
fs.writeFileSync(join(buildDir, 'package.json'), JSON.stringify(packageJSON, undefined, 2), 'utf8')
fs.copyFileSync('./README.md', join(buildDir, 'README.md'))
