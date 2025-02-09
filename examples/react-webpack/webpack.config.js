const path = require('path')
const {PostcssScopedPlugin, BabelScopedPlugin} = require('../../lib/index.js')
const HtmlWebpackPlugin = require('html-webpack-plugin')


module.exports = {
  mode: 'development',
  devtool: false,
  entry: './src/main.js',
  output: {
    clean: true,
    filename: '[name]-[contenthash:6].js',
    path: path.resolve(__dirname, './build')
  },
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  new PostcssScopedPlugin()
                ]
              }
            }
          },
          '../../lib/loader.js'
        ]
      },
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
            plugins: [
              [
                BabelScopedPlugin,
                {
                  entryFiles: [path.resolve(__dirname, './src/main.js')]
                }
              ]
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ]
}