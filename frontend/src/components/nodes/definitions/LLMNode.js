import { AiBrain02Icon } from '@hugeicons/core-free-icons';

export const llmNodeConfig = {
  type: 'llm',
  label: 'LLM',
  icon: AiBrain02Icon,
  accentColor: '#8b5cf6',
  handles: {
    inputs: [
      { id: 'system', label: 'System' },
      { id: 'prompt', label: 'Prompt' },
    ],
    outputs: [{ id: 'response', label: 'Response' }],
  },
  fields: [
    {
      key: 'description',
      type: 'readonly',
      text: 'Processes text using a large language model. Connect a system prompt and user prompt.',
    },
  ],
};
