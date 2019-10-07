const fs = require('fs')
const path = require('path')
const { createMacro } = require('babel-plugin-macros')
const parse = require('csv-parse/lib/sync')

module.exports = createMacro(graphqlMacro)
module.exports.csvLoader = path => []

function graphqlMacro({
  references,
  state: {
    file: {
      opts: { filename },
    },
  },
  babel: { types: t },
}) {
  references.csvLoader.forEach(referencePath => {
    referencePath.parentPath.node.arguments.forEach(({ value }) => {
      const absolutePath = path.join(filename, '..', value)
      const json = parse(fs.readFileSync(absolutePath, 'utf8'), {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        // skip_lines_with_error: true,
        quote: false,
        // escape: '\''
      })
      referencePath.parentPath.replaceWithSourceString(JSON.stringify(json))
    })
  })
}
