import { Clock01Icon } from '@hugeicons/core-free-icons';

export const timerNodeConfig = {
  type: 'timer',
  label: 'Timer',
  icon: Clock01Icon,
  accentColor: '#06b6d4',
  handles: {
    inputs: [{ id: 'trigger', label: 'Trigger' }],
    outputs: [{ id: 'output', label: 'Output' }],
  },
  fields: [
    {
      key: 'duration',
      type: 'number',
      label: 'Duration',
      placeholder: '1000',
      min: 0,
      defaultValue: 1000,
    },
    {
      key: 'unit',
      type: 'select',
      label: 'Unit',
      options: [
        { value: 'ms', label: 'Milliseconds' },
        { value: 's', label: 'Seconds' },
        { value: 'min', label: 'Minutes' },
      ],
      defaultValue: 'ms',
    },
  ],
};
