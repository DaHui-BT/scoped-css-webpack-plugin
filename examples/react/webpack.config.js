const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {BabelScopedPlugin, PostcssScopedPlugin} = require('scoped-css-webpack-plugin')


module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: './src/main.js',
  output: {
    clean: true,
    filename: '[name]-[contenthash:6].js',
    path: path.resolve(__dirname, './build')
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              // if you are in a react project
              presets: ['@babel/preset-react'],
              plugins: [
                [
                  BabelScopedPlugin,
                  {entryFiles: [path.resolve(__dirname, './src/main.js')]}
                ]
              ]
            }
          }
        ]
      },
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
                  [
                    new PostcssScopedPlugin()
                  ]
                ]
              }
            }
          },
          {
            loader: 'scoped-css-webpack-plugin/loaders/scope-id-loader'
          },
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ]
}