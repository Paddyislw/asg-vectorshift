import { ShuffleIcon } from '@hugeicons/core-free-icons';

export const dataTransformNodeConfig = {
  type: 'dataTransform',
  label: 'Data Transform',
  icon: ShuffleIcon,
  accentColor: '#ec4899',
  handles: {
    inputs: [{ id: 'input', label: 'Input' }],
    outputs: [{ id: 'output', label: 'Output' }],
  },
  fields: [
    {
      key: 'transformType',
      type: 'select',
      label: 'Transform',
      options: [
        { value: 'map', label: 'Map' },
        { value: 'filter', label: 'Filter' },
        { value: 'reduce', label: 'Reduce' },
        { value: 'flatten', label: 'Flatten' },
      ],
      defaultValue: 'map',
    },
    {
      key: 'expression',
      type: 'text',
      label: 'Expression',
      placeholder: 'item.value',
    },
    {
      key: 'strict',
      type: 'checkbox',
      label: 'Strict Mode',
      checkboxLabel: 'Enable strict mode',
      defaultValue: false,
    },
  ],
};
