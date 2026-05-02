import { useCallback } from 'react';
import { useStore } from '@/store/useStore';
import { NodeHeader } from './NodeHeader';
import { NodeField } from './NodeField';
import { NodeHandle } from './NodeHandle';

/**
 * Node component that renders a node based on the provided config.
 */
export const BaseNode = ({ id, data, config, children }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);

  const handleFieldChange = useCallback(
    (fieldKey, value) => {
      updateNodeField(id, fieldKey, value);
    },
    [id, updateNodeField]
  );

  const { label, icon, accentColor, handles, fields, description, minWidth } = config;

  const inputHandles = handles?.inputs || [];
  const outputHandles = handles?.outputs || [];

  const widthStyle = minWidth ? { minWidth: `${minWidth}px` } : undefined;

  return (
    <div
      className="node-wrapper  relative bg-surface border border-surface-border rounded-node shadow-node hover:shadow-node-hover transition-all duration-normal min-w-[200px] max-w-[380px] animate-fade-in"
      style={widthStyle}
    >
      <NodeHeader icon={icon} label={label} accentColor={accentColor} />

      <div className="px-3 py-2.5 flex flex-col gap-2">
        {description && (
          <p className="text-node-sm text-text-muted">{description}</p>
        )}

        {fields?.map((field) => (
          <NodeField
            key={field.key}
            field={field}
            value={data[field.key] ?? field.defaultValue}
            onChange={(value) => handleFieldChange(field.key, value)}
          />
        ))}

        {children}
      </div>

      {inputHandles.map((handle, idx) => (
        <NodeHandle
          key={handle.id}
          type="target"
          id={`${id}-${handle.id}`}
          label={handle.label}
          position="left"
          index={idx}
          total={inputHandles.length}
        />
      ))}

      {outputHandles.map((handle, idx) => (
        <NodeHandle
          key={handle.id}
          type="source"
          id={`${id}-${handle.id}`}
          label={handle.label}
          position="right"
          index={idx}
          total={outputHandles.length}
        />
      ))}
    </div>
  );
};
