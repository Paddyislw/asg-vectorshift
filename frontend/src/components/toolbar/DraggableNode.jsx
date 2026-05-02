import { HugeiconsIcon } from '@hugeicons/react';

export const DraggableNode = ({ type, label, icon, accentColor }) => {
  const onDragStart = (event) => {
    event.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify({ nodeType: type })
    );
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      onDragStart={onDragStart}
      draggable
      className="flex items-center gap-2 px-3 py-2 rounded-full border border-surface-border bg-surface cursor-grab hover:shadow-node hover:border-accent-purple/40 active:cursor-grabbing transition-all duration-fast select-none"
    >
      {icon && (
        <span
          className="flex items-center justify-center w-6 h-6 rounded-full shrink-0"
          style={{ backgroundColor: `${accentColor}18` }}
        >
          <HugeiconsIcon icon={icon} size={13} style={{ color: accentColor }} />
        </span>
      )}
      <span className="text-node-sm font-medium text-text-primary whitespace-nowrap">
        {label}
      </span>
    </div>
  );
};
