//@ts-nocheck
import parser, { Attribute, AttributeOptions } from 'postcss-selector-parser'

/**
 * PostCSS plugin to add scoped attributes to CSS selectors.
 * @param {Object} options - Plugin configuration options.
 * @param {string[]} [options.includeTypes=['class', 'id', 'tag']] - Node types to include for scoping.
 * @param {string[]} [options.excludeTypes=['pseudo', 'combinator', 'comment']] - Node types to exclude from scoping.
 * @returns {Object} - PostCSS plugin object.
 */
function PostcssScopedPlugin(options: { includeTypes?: string[], excludeTypes?: string[] } = {}) {
  // Default configuration
  const baseOptions = {
    includeTypes: ['class', 'id', 'tag'], // Node types to include for scoping
    excludeTypes: ['pseudo', 'combinator', 'comment'], // Node types to exclude from scoping
  };

  // Merge user options with default options
  const config = { ...baseOptions, ...options };

  /**
   * Main plugin logic to add scoped attributes to CSS selectors.
   * @returns {Object} - PostCSS plugin object.
   */
  function createScopedPlugin() {
    return {
      postcssPlugin: 'postcss-scoped',
      Once(root: any, { result }: {result: any}) {
        // Regular expression to extract scope ID from the first comment
        const scopeId = root.first?.text?.match(/@scopeId: (\S+)/)?.[1];

        // Skip if no scope ID is found
        if (!scopeId) return;

        // Process each rule in the CSS
        root.walkRules((rule: any) => {
          rule.selectors = rule.selectors.map((selector: parser.Selectors) => {
            return parser((selectors: parser.Root) => {
              selectors.walk((node: parser.Node) => {
                // Skip excluded node types
                if (config.excludeTypes.includes(node.type)) return;

                // Add scoped attribute to included node types
                if (config.includeTypes.includes(node.type)) {
                  const attribute: Attribute = parser.attribute({
                    attribute: scopeId,
                    // operator: '', // No operator (e.g., =, ~=)
                    value: undefined,
                    raws: { value: '' }
                  } as AttributeOptions)
                  
                  node?.parent?.insertAfter(node, attribute);
                }
              });
            }).processSync(selector);
          });
        });
      }
    };
  }

  // Mark the plugin as a PostCSS plugin
  createScopedPlugin.postcss = true;

  return createScopedPlugin;
}

export default PostcssScopedPlugin
