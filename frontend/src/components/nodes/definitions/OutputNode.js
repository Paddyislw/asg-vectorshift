import { Upload04Icon } from '@hugeicons/core-free-icons';

export const outputNodeConfig = {
  type: 'customOutput',
  label: 'Output',
  icon: Upload04Icon,
  accentColor: '#ef4444',
  handles: {
    inputs: [{ id: 'value', label: 'Value' }],
    outputs: [],
  },
  fields: [
    {
      key: 'outputName',
      type: 'text',
      label: 'Name',
      placeholder: 'output_name',
    },
    {
      key: 'outputType',
      type: 'select',
      label: 'Type',
      options: [
        { value: 'Text', label: 'Text' },
        { value: 'Image', label: 'Image' },
      ],
      defaultValue: 'Text',
    },
  ],
  getDefaultData: (nodeId) => ({
    outputName: nodeId.replace('customOutput-', 'output_'),
    outputType: 'Text',
  }),
};
