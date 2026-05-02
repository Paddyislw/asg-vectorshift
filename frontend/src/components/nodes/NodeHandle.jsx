import { Handle, Position } from 'reactflow';
import { cn } from '@/helpers/cn';

const POSITION_MAP = {
  left: Position.Left,
  right: Position.Right,
  top: Position.Top,
  bottom: Position.Bottom,
};

/**
 * Calculates the vertical position for evenly spacing handles.
 */
function getHandleOffset(index, total) {
  if (total <= 1) return '50%';
  const step = 100 / (total + 1);
  return `${step * (index + 1)}%`;
}

export const NodeHandle = ({ type, id, position, index, total, label }) => {
  const offset = getHandleOffset(index, total);
  const isLeft = position === 'left';

  return (
    <div
      className="absolute group"
      style={{ top: offset, [isLeft ? 'left' : 'right']: 0 }}
    >
      <Handle
        type={type}
        position={POSITION_MAP[position]}
        id={id}
      />
      {label && (
        <span
          className={cn(
            'absolute top-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none',
            'text-[10px] font-medium text-text-secondary',
            'bg-zinc-500 text-white border border-surface-border rounded px-2 py-1 shadow-2xl',
            'opacity-0 group-hover:opacity-100  transition-opacity duration-150',
            isLeft ? 'left-2' : 'right-2',
          )}
        >
          {label}
        </span>
      )}
    </div>
  );
};


