module.exports = function(config) {
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