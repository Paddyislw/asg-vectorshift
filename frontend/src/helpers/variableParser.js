/**
 * Regex to match {{ variableName }} patterns.
 * Accepts valid JS identifiers: starts with letter/underscore/$,
 * followed by letters/digits/underscores/$.
 * Allows whitespace inside the braces.
 */
const VARIABLE_REGEX = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;

/**
 * Parses text and extracts unique variable names from {{ var }} patterns.
 * @param {string} text - The text to parse
 * @returns {string[]} Array of unique variable names, in order of first appearance
 */
export function parseVariables(text) {
  if (!text) return [];

  const seen = new Set();
  const variables = [];

  let match;
  while ((match = VARIABLE_REGEX.exec(text)) !== null) {
    const varName = match[1];
    if (!seen.has(varName)) {
      seen.add(varName);
      variables.push(varName);
    }
  }

  // Reset regex lastIndex for next call
  VARIABLE_REGEX.lastIndex = 0;

  return variables;
}
