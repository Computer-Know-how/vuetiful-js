// Dependencies
const _ = require('lodash')
const fs = require('fs-extra')
const path = require('path')

// Helpers
const generatePackageJson = require('./helpers/generate-package-json')
const generateReadme = require('./helpers/generate-readme')
const packageInfo = require('../../../../package.json');

module.exports = (componentName) => {
  const builds = [
    {
      type: 'common',
      dest: 'cjs'
    },
    {
      type: 'umd'
    },
    {
      type: 'umd.min'
    }
  ]

  const packageName = _.compact([
    packageInfo.name,
    _.kebabCase(componentName)
	]).join('/')

  const destPackageFolder = path.resolve(
    __dirname,
    `../packages/${packageName}`
  )

  for (const build of builds) {
    const oldIndexPath = path.resolve(
      __dirname,
      `../dist/${componentName || ''}/index.${build.type}.js`
    )
    const [buildTypeBase, buildModifier] = build.type.split('.')
    const destFolder = path.resolve(
      destPackageFolder,
      build.dest != null ? build.dest : buildTypeBase
    )
    const newIndexPath = path.resolve(
      destFolder,
      `index${buildModifier ? '.' + buildModifier : ''}.js`
    )
    if (!fs.existsSync(destPackageFolder)) {
      fs.mkdirSync(destPackageFolder)
    }
    if (!fs.existsSync(destFolder)) {
      fs.mkdirSync(destFolder)
    }
    const oldMapPath = oldIndexPath + '.map'
    const newMapPath = newIndexPath + '.map'

    fs.renameSync(oldIndexPath, newIndexPath)
    fs.renameSync(oldMapPath, newMapPath)
    fs.writeFileSync(
      newIndexPath,
      fs
        .readFileSync(newIndexPath, { encoding: 'utf8' })
        .replace(path.basename(oldMapPath), path.basename(newMapPath))
    )
  }

  fs.copySync(getPath('../src'), path.resolve(destPackageFolder, 'src'), {
    filter: filePath => {
      return !/\.unit\.js$/.test(filePath)
    }
  })
  fs.writeFileSync(
    path.resolve(destPackageFolder, 'index.js'),
    `\
export * from './src${componentName ? '/' + componentName + '.vue' : ''}'
`
  )

  let description = packageInfo.description
  let example

  const packageConfig = {
    name: packageName,
    moduleName: componentName || _.upperFirst(_.camelCase(packageName)),
    description,
    example
  }
  console.info(`📝 Writing package.json for ${packageConfig.moduleName}`)
  fs.writeFileSync(
    path.resolve(destPackageFolder, 'package.json'),
    generatePackageJson(packageConfig)
  )
  console.info(`🤓 Writing readme file for ${packageConfig.moduleName}`)
  fs.writeFileSync(
    path.resolve(destPackageFolder, 'README.md'),
    generateReadme(packageConfig)
  )
  console.info(`☝️ Adding license for ${packageConfig.moduleName}`)
  fs.writeFileSync(
    path.resolve(destPackageFolder, 'LICENSE'),
    `\
The MIT License (MIT)

Copyright (c) 2018-present, ${packageInfo.author.name}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
`
  )

  if (componentName) {
    const componentPackageFolder = path.resolve(
      __dirname,
      `../packages/${packageInfo.name}/${componentName}`
    )
    fs.copySync(destPackageFolder, componentPackageFolder, {
      filter: filePath => {
        return !/(LICENSE|README\.md|src)$/.test(filePath)
      }
    })
    fs.writeFileSync(
      path.resolve(componentPackageFolder, 'index.js'),
      `\
export * from '${path.join('../src', componentName || '')}'
`
    )
  }
}