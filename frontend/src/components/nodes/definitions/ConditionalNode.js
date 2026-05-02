import { GitBranchIcon } from '@hugeicons/core-free-icons';

export const conditionalNodeConfig = {
  type: 'conditional',
  label: 'Conditional',
  icon: GitBranchIcon,
  accentColor: '#f59e0b',
  handles: {
    inputs: [{ id: 'data', label: 'Data' }],
    outputs: [
      { id: 'true', label: 'True' },
      { id: 'false', label: 'False' },
    ],
  },
  fields: [
    {
      key: 'field',
      type: 'text',
      label: 'Field',
      placeholder: 'field_name',
    },
    {
      key: 'operator',
      type: 'select',
      label: 'Operator',
      options: [
        { value: 'equals', label: 'Equals' },
        { value: 'not_equals', label: 'Not Equals' },
        { value: 'contains', label: 'Contains' },
        { value: 'greater_than', label: 'Greater Than' },
        { value: 'less_than', label: 'Less Than' },
      ],
      defaultValue: 'equals',
    },
    {
      key: 'value',
      type: 'text',
      label: 'Value',
      placeholder: 'comparison_value',
    },
  ],
};
