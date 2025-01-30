/**
 * Webpack loader that injects scope ID into CSS content
 * @param {string} source - The source code of the file being processed
 * @returns {string} - Processed source code with scope ID comment
 * @throws {Error} If scope ID is found but source is not a string
 */
module.exports = function ScopeIdLoader(source) {
  // Regular expression to strictly match scopeId parameter
  const SCOPE_ID_REGEX = /scopeId=([^&]+)/;
  
  try {
    // Extract scopeId from resource query parameters
    const scopeIdMatch = this.resourceQuery.match(SCOPE_ID_REGEX);
    const scopeId = scopeIdMatch?.[1];

    if (!scopeId) {
      return source;
    }

    // Validate scopeId format
    if (!/^[a-zA-Z0-9_-]+$/.test(scopeId)) {
      throw new Error(`Invalid scopeId format: ${scopeId}`);
    }

    // Prepend scope ID comment to the source
    return `/* @scopeId: ${scopeId} */\n${source}`;
    
  } catch (error) {
    // Pass errors to webpack's loader context
    this.emitError(new Error(
      `scope-id-loader: ${error.message}\n${error.stack}`
    ));
    return source; // Return original source on error
  }
};

// Mark the loader as raw for binary file handling
module.exports.raw = true;
