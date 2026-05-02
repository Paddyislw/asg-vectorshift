import { SelectDropdown } from './SelectDropdown';

const BASE_INPUT_CLASSES =
  'w-full bg-surface-card border border-surface-border rounded-lg px-2.5 py-1.5 ' +
  'text-node-sm text-text-primary placeholder:text-text-muted ' +
  'focus:outline-none focus:border-accent-purple-dark focus:ring-1 focus:ring-accent-purple-dark/30 ' +
  'transition-colors duration-fast';

export const FIELD_RENDERERS = {
  text: ({ field, value, onChange }) => (
    <input
      type="text"
      className={BASE_INPUT_CLASSES}
      value={value ?? ''}
      placeholder={field.placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  ),

  textarea: ({ field, value, onChange }) => (
    <textarea
      className={`${BASE_INPUT_CLASSES} resize-none`}
      rows={field.rows || 3}
      value={value ?? ''}
      placeholder={field.placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  ),

  select: ({ field, value, onChange }) => (
    <SelectDropdown
      options={field.options}
      value={value}
      onChange={onChange}
      placeholder={field.placeholder}
    />
  ),

  number: ({ field, value, onChange }) => (
    <input
      type="number"
      className={BASE_INPUT_CLASSES}
      value={value ?? ''}
      min={field.min}
      max={field.max}
      step={field.step}
      placeholder={field.placeholder}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  ),

  checkbox: ({ field, value, onChange }) => (
    <label className="flex items-center gap-2 cursor-pointer py-0.5">
      <input
        type="checkbox"
        checked={!!value}
        onChange={(e) => onChange(e.target.checked)}
        className="w-3.5 h-3.5 rounded accent-accent-purple-dark"
      />
      <span className="text-node-sm text-text-secondary">
        {field.checkboxLabel || field.label}
      </span>
    </label>
  ),

  slider: ({ field, value, onChange }) => (
    <div className="flex items-center gap-2">
      <input
        type="range"
        min={field.min ?? 0}
        max={field.max ?? 100}
        step={field.step ?? 1}
        value={value ?? field.min ?? 0}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 accent-accent-purple-dark"
      />
      <span className="text-node-xs text-text-muted w-8 text-right tabular-nums">
        {value ?? field.min ?? 0}
      </span>
    </div>
  ),

  readonly: ({ field }) => (
    <p className="text-node-sm text-text-muted leading-relaxed">{field.text}</p>
  ),
};
