import { useMemo } from 'react';
import { parseVariables } from '@/helpers/variableParser';

/**
 * Hook that parses {{ variable }} patterns from text.
 * Returns a stable array of unique variable names.
 */
export function useVariableParser(text) {
  const variables = useMemo(() => parseVariables(text), [text]);
  return variables;
}
