import { Download04Icon } from '@hugeicons/core-free-icons';

export const inputNodeConfig = {
  type: 'customInput',
  label: 'Input',
  icon: Download04Icon,
  accentColor: '#22c55e',
  handles: {
    inputs: [],
    outputs: [{ id: 'value', label: 'Value' }],
  },
  fields: [
    {
      key: 'inputName',
      type: 'text',
      label: 'Name',
      placeholder: 'input_name',
    },
    {
      key: 'inputType',
      type: 'select',
      label: 'Type',
      options: [
        { value: 'Text', label: 'Text' },
        { value: 'File', label: 'File' },
      ],
      defaultValue: 'Text',
    },
  ],
  getDefaultData: (nodeId) => ({
    inputName: nodeId.replace('customInput-', 'input_'),
    inputType: 'Text',
  }),
};
