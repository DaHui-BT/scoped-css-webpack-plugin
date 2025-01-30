const BabelScopedPlugin = require('./loaders/babel-scoped-plugin')
const PostcssScopedPlugin = require('./loaders/postcss-scoped-plugin')
const ScopedCSSWebpackPlugin = require('./loaders/scope-id-loader')

module.exports = {
  BabelScopedPlugin,
  PostcssScopedPlugin,
  ScopedCSSWebpackPlugin
}
