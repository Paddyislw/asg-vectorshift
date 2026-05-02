import { StickyNote01Icon } from '@hugeicons/core-free-icons';

export const noteNodeConfig = {
  type: 'note',
  label: 'Note',
  icon: StickyNote01Icon,
  accentColor: '#eab308',
  handles: {
    inputs: [],
    outputs: [],
  },
  description: 'Add comments or documentation to your pipeline.',
  fields: [
    {
      key: 'content',
      type: 'textarea',
      label: 'Content',
      placeholder: 'Write your notes here...',
      rows: 4,
    },
  ],
};
