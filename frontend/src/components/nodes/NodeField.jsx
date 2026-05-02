import { FIELD_RENDERERS } from './fieldRenderers';

export const NodeField = ({ field, value, onChange }) => {
  const Renderer = FIELD_RENDERERS[field.type];
  if (!Renderer) return null;

  // Checkbox renders its own label inline
  if (field.type === 'checkbox') {
    return <Renderer field={field} value={value} onChange={onChange} />;
  }

  return (
    <div className="flex flex-col gap-1">
      {field.label && (
        <label className="text-node-xs font-medium text-text-secondary uppercase tracking-wide">
          {field.label}
        </label>
      )}
      <Renderer field={field} value={value} onChange={onChange} />
    </div>
  );
};
