# scoped-css-webpack-plugin 🎨

A zero-configuration solution for scoped CSS in React applications, providing automatic style encapsulation similar to Vue's scoped styles.

In this package, you can write your style in a single file, import the style in the component, and the style will only work on the imported file, and the style imported by the entry file will be effective globally.


## ✨ Features

- **Automatic Scoping**  
  Automatically generates unique scope IDs for components
- **CSS Isolation**  
  Prevents style leakage between components
- **Framework Agnostic**  
  Works with any CSS preprocessor (Sass/Less/Stylus)
- **Production-Ready**  
  Supports CSS extraction and optimization
- **Zero Runtime**  
  All processing happens at build time


## Install
```bash
npm install scoped-css-webpack-plugin --save-dev
# or
yarn add scoped-css-webpack-plugin -D
```

## 🚀 Basic Usage

Webpack Configuration

```javascript
// webpack.config.js
const path = require('path')

const {BabelScopedPlugin, PostcssScopedPlugin} = require('scoped-css-loader')

module.exports = {
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
                  BabelScopedPlugin
                ]
              ]
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
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
            loader: require('scoped-css-loader/scope-id-loader')
          }
        ]
      }
    ]
  }
}
```

Component css file

```css
.my-component {
  padding: 10px 20px;
  background-color: blue;
}

.my-component-title {
  color: red;
}
```

Component JSX file

```jsx
import './mycomponent.css'

function MyComponent() {
  return (
    <div className='my-component'>
      <h1 className='my-component-title'>Hello World</h1>
    </div>
  );
}
```

## 🔧 Configuration Options

### Babel Plugin Options

```javascript
{
  plugins: [
    ['scoped-css-loader/babel-scoped-plugin', {
      entryFiles: ['./src/main.js'], // Required: entry files array
      prefix: 'data-scope-',         // Scope ID prefix
      fileSuffix: [                  // File extensions to process
        '.css',
        '.scss',
        '.sass',
        '.less'
      ],
      generateScopeId: (filePath) =>  // Custom ID generator
        `scope-${md5(filePath).slice(0,8)}`
    }]
  ]
}
```

### PostCSS Plugin Options

```javascript
{
  plugins: [
    ['scoped-css-loader/postcss-scoped-plugin', {
      includeTypes: ['class', 'id', 'tag'],  // Selector types to scope
      excludeTypes: ['pseudo', 'comment'],   // Selector types to exclude
      commentPrefix: '@scope-id'             // Comment marker prefix
    }]
  ]
}
```

## 🎯 Advanced Features
### Custom Scope Formatting
```javascript
// Custom ID generator example
const { generateScopeId } = require('react-scoped-styles/utils');

function customGenerator(filePath) {
  return `app-${generateScopeId(filePath)}-${Date.now()}`;
}
```

### Global Styles

Mark entry files in Babel config:

```javascript
// webpack.config.js
{
  entryFiles: [
    './src/main.js',       // Main entry
  ]
}
```

### Scoped JSX
Input:

```jsx
function MyComponent() {
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
}
```

Output:

```jsx
function MyComponent() {
  return (
    <div data-scope-abc123>
      <h1 data-scope-abc123>Hello World</h1>
    </div>
  );
}
```

### 📄 Generated CSS
Input:

```css
/* @scope-id: data-scope-abc123 */
.container {
  padding: 20px;
}
```

Output:

```css
.container[data-scope-abc123] {
  padding: 20px;
}
```

