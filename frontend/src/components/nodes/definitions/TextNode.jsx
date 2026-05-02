import { useCallback, useEffect, useMemo } from 'react';
import { useUpdateNodeInternals } from 'reactflow';
import { TextFontIcon } from '@hugeicons/core-free-icons';
import { useStore } from '@/store/useStore';
import { useAutoResize } from '@/hooks/useAutoResize';
import { useVariableParser } from '@/hooks/useVariableParser';
import { NodeHeader } from '../NodeHeader';
import { NodeHandle } from '../NodeHandle';

export const textNodeConfig = {
  type: 'text',
  label: 'Text',
  icon: TextFontIcon,
  accentColor: '#7b6fc4',
  minWidth: 280,
  handles: {
    inputs: [],
    outputs: [{ id: 'output', label: 'Output' }],
  },
  fields: [],
  getDefaultData: () => ({
    text: '{{input}}',
  }),
};

export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);
  const updateNodeInternals = useUpdateNodeInternals();

  const text = data?.text ?? '{{input}}';
  const variables = useVariableParser(text);
  const { dimensions } = useAutoResize(text);

  // Force ReactFlow to recalculate handle positions when variables change
  useEffect(() => {
    updateNodeInternals(id);
  }, [id, variables, updateNodeInternals]);

  const handleTextChange = useCallback(
    (e) => {
      updateNodeField(id, 'text', e.target.value);
    },
    [id, updateNodeField]
  );

  // Build dynamic input handles from parsed variables
  const dynamicInputHandles = useMemo(
    () => variables.map((varName) => ({ id: varName, label: varName })),
    [variables]
  );

  const outputHandles = textNodeConfig.handles.outputs;

  return (
    <div
      className="node-wrapper relative bg-surface border border-surface-border rounded-node shadow-node hover:shadow-node-hover transition-all duration-normal animate-fade-in"
      style={{
        minWidth: `${dimensions.width}px`,
        maxWidth: '500px',
      }}
    >
      <NodeHeader
        icon={textNodeConfig.icon}
        label={textNodeConfig.label}
        accentColor={textNodeConfig.accentColor}
      />

      <div className="px-3 py-2.5 flex flex-col gap-1">
        <label className="text-node-xs font-medium text-text-secondary uppercase tracking-wide">
          Text
        </label>
        <textarea
          className="w-full bg-surface-card border border-surface-border rounded-lg px-2.5 py-1.5 text-node-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-purple-dark focus:ring-1 focus:ring-accent-purple-dark/30 transition-colors duration-fast resize-none"
          value={text}
          placeholder="Enter text with {{ variables }}..."
          onChange={handleTextChange}
          style={{ height: `${dimensions.height}px` }}
        />
        {variables.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {variables.map((v) => (
              <span
                key={v}
                className="text-node-xs bg-accent-purple/10 text-accent-purple-dark px-1.5 py-0.5 rounded font-medium"
              >
                {v}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Dynamic input handles from {{ variables }} */}
      {dynamicInputHandles.map((handle, idx) => (
        <NodeHandle
          key={handle.id}
          type="target"
          id={`${id}-${handle.id}`}
          label={handle.label}
          position="left"
          index={idx}
          total={dynamicInputHandles.length}
        />
      ))}

      {/* Static output handle */}
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
