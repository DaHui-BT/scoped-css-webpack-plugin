const { createHash } = require('crypto');

/**
 * Generates a unique scope ID based on file path
 * @param {string} filePath - The file path to generate hash from
 * @param {string} [tagPrefix='data-scope-'] - Prefix for the generated scope ID
 * @returns {string} The generated scope ID with prefix
 * @throws {TypeError} If filePath is not a string
 */
const generateScopeId = (filePath, tagPrefix = 'data-scope-') => {
  if (typeof filePath !== 'string') {
    throw new TypeError('filePath must be a string');
  }

  const hash = createHash('sha256')
    .update(filePath)
    .digest('hex');

  return `${tagPrefix}${hash.slice(0, 8)}`;
};

module.exports = {
  generateScopeId
};