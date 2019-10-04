module.exports = function(config) {
  if (config.mode === 'production') {
    // console.log(config.output.publicPath)
    // const indexExclude = /index\.html/
    // const workboxConfig = config.plugins[8].config
    // workboxConfig.exclude = [indexExclude, ...workboxConfig.exclude]
    // delete workboxConfig.navigateFallback
    // delete workboxConfig.navigateFallbackBlacklist
    // console.log(config.plugins[8].config)
    // process.exit()
  }
  // load eslint from file
  // revert on https://github.com/facebook/create-react-app/pull/6513
  const eslintRule = config.module.rules[1]
  eslintRule.test = /\.(js|mjs|jsx|ts|tsx)$/
  const eslintOptions = eslintRule.use[0].options
  delete eslintOptions.baseConfig
  delete eslintOptions.ignore
  delete eslintOptions.useEslintrc

  return config
}
