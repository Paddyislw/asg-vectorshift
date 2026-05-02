import { ApiIcon } from '@hugeicons/core-free-icons';

export const apiNodeConfig = {
  type: 'api',
  label: 'API Request',
  icon: ApiIcon,
  accentColor: '#3b82f6',
  minWidth: 280,
  handles: {
    inputs: [{ id: 'body', label: 'Body' }],
    outputs: [{ id: 'response', label: 'Response' }],
  },
  fields: [
    {
      key: 'url',
      type: 'text',
      label: 'URL',
      placeholder: 'https://api.example.com/endpoint',
    },
    {
      key: 'method',
      type: 'select',
      label: 'Method',
      options: [
        { value: 'GET', label: 'GET' },
        { value: 'POST', label: 'POST' },
        { value: 'PUT', label: 'PUT' },
        { value: 'DELETE', label: 'DELETE' },
      ],
      defaultValue: 'GET',
    },
    {
      key: 'headers',
      type: 'textarea',
      label: 'Headers',
      placeholder: '{"Content-Type": "application/json"}',
      rows: 2,
    },
  ],
};
