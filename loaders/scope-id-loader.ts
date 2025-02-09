import { LoaderContext } from 'webpack';


/**
 * Webpack loader that injects scope ID into CSS content
 * @param {string} source - The source code of the file being processed
 * @returns {string} - Processed source code with scope ID comment
 * @throws {Error} If scope ID is found but source is not a string
 */
function ScopeIdLoader(this: LoaderContext<unknown>, source: string): string {
  // Regular expression to strictly match scopeId parameter
  const SCOPE_ID_REGEX: RegExp = /scopeId=([^&]+)/;
  
  try {
    // Extract scopeId from resource query parameters
    const scopeIdMatch: RegExpMatchArray | null = this.resourceQuery.match(SCOPE_ID_REGEX);
    const scopeId: string | undefined = scopeIdMatch?.[1];

    if (!scopeId) {
      return source;
    }

    // Validate scopeId format
    if (!/^[a-zA-Z0-9_-]+$/.test(scopeId)) {
      throw new Error(`Invalid scopeId format: ${scopeId}`);
    }

    // Prepend scope ID comment to the source
    return `/* @scopeId: ${scopeId} */\n${source}`;
    
  } catch (error: any) {
    // Pass errors to webpack's loader context
    this.emitError(new Error(
      `scope-id-loader: ${error.message}\n${error.stack}`
    ));
    return source; // Return original source on error
  }
};

// Mark the loader as raw for binary file handling
module.exports.raw = true;
module.exports = ScopeIdLoader
