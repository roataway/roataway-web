const cp = require('child_process')

const commitHash = cp
  .execSync('git rev-parse HEAD')
  .toString()
  .trim()

const commitDatetime = cp
  .execSync(`git show -s --format=%ci ${commitHash}`)
  .toString()
  .trim()

process.env.REACT_APP_DEPLOY_DATE = commitDatetime
process.env.REACT_APP_DEPLOY_HASH = commitHash.substr(0, 7)