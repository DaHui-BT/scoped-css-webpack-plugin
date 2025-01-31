const { generateScopeId } = require('../utils/generateScopedId');

/**
 * Default plugin configuration
 * @constant
 * @type {Object}
 */
const BASE_OPTIONS = {
  prefix: 'data-scope-',
  fileSuffix: ['.css', '.less', '.scss', '.sass'],
  generateScopeId: generateScopeId
};

/**
 * Babel plugin to add scoped attributes to JSX elements and CSS imports
 * @param {Object} babel - Babel API
 * @returns {Object} Babel visitor object
 */
module.exports = function(babel) {
  const { types: t } = babel;

  /**
   * Validate required configuration
   * @param {Object} config - Plugin configuration
   * @throws {Error} If required options are missing
   */
  function validateConfig(config) {
    if (!config.entryFiles || !Array.isArray(config.entryFiles)) {
      throw new Error('entryFiles option is required and must be an array');
    }
  }

  return {
    visitor: {
      /**
       * Process import declarations
       * @param {Object} path - Babel path object
       * @param {Object} state - Plugin state
       */
      ImportDeclaration(path, state) {
        const config = {
          ...BASE_OPTIONS,
          ...state.opts
        };

        validateConfig(config);

        const filePath = state.filename;
        if (!state.scopeId) {
          state.scopeId = config.generateScopeId(
            filePath, 
            config.prefix
          );
        }

        // Check if current file is an entry file
        const isEntryFile = config.entryFiles.some(entry => 
          filePath.endsWith(entry)
        );

        // Extract file extension
        const fileExtension = path.node.source.value.slice(
          path.node.source.value.lastIndexOf('.')
        );

        // Process CSS-like imports
        if (config.fileSuffix.includes(fileExtension)) {
          const originalPath = path.node.source.value;
          path.node.source.value = isEntryFile
            ? originalPath
            : `${originalPath}?scopeId=${state.scopeId}`;
        }
      },

      /**
       * Add scope attributes to JSX elements
       * @param {Object} path - Babel path object
       * @param {Object} state - Plugin state
       */
      JSXOpeningElement(path, state) {
        if (!state.scopeId) return;

        path.node.attributes.push(
          t.jsxAttribute(
            t.jsxIdentifier(state.scopeId),
            t.stringLiteral("")
          )
        );
      }
    }
  };
};