import CryptoJS from 'crypto-js'

/**
 * Generates a unique scope ID based on file path
 * @param {string} filePath - The file path to generate hash from
 * @param {string} [tagPrefix='data-scope-'] - Prefix for the generated scope ID
 * @returns {string} The generated scope ID with prefix
 * @throws {TypeError} If filePath is not a string
 */
const generateScopeId = (filePath: string, tagPrefix: string = 'data-scope-'): string => {
  if (typeof filePath !== 'string') {
    throw new TypeError('filePath must be a string');
  }
  
  const hash = CryptoJS.SHA256(filePath).toString(CryptoJS.enc.Hex)

  return `${tagPrefix}${hash.slice(0, 8)}`;
};

export {
  generateScopeId
};