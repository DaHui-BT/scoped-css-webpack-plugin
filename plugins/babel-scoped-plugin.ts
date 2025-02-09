import { PluginObj, types as t, NodePath, PluginPass } from '@babel/core'
import { generateScopeId } from '../utils/generateScopedId'


interface BaseOptions {
  entryFiles: string[];
  generateScopeId: (filePath: string, prefix: string) => string;
  prefix: string;
  fileSuffix: string[];
}

/**
 * Default plugin configuration
 * @constant
 * @type {Object}
 */
const BASE_OPTIONS: BaseOptions = {
  entryFiles: [],
  prefix: 'data-scope-',
  fileSuffix: ['.css', '.less', '.scss', '.sass'],
  generateScopeId: generateScopeId
};

/**
 * Babel plugin to add scoped attributes to JSX elements and CSS imports
 * @param {Object} babel - Babel API
 * @returns {Object} Babel visitor object
 */
export default function(babel: { types: typeof t}): PluginObj {

  /**
   * Validate required configuration
   * @param {Object} config - Plugin configuration
   * @throws {Error} If required options are missing
   */
  function validateConfig(config: BaseOptions) {
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
      ImportDeclaration(path: NodePath<t.ImportDeclaration>, state: PluginPass) {
        const config: BaseOptions = {
          ...BASE_OPTIONS,
          ...state.opts
        };

        validateConfig(config);

        const filePath = state.filename as string;
        if (!state.scopeId) {
          state.scopeId = config.generateScopeId(
            filePath, 
            config.prefix
          );
        }

        // Check if current file is an entry file
        const isEntryFile = config.entryFiles.some((entry: string) => 
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
      JSXOpeningElement(path: NodePath<t.JSXOpeningElement>, state: PluginPass) {
        if (!state.scopeId) return;

        path.node.attributes.push(
          t.jsxAttribute(
            t.jsxIdentifier(state.scopeId as string),
            t.stringLiteral("")
          )
        );
      }
    }
  };
};
