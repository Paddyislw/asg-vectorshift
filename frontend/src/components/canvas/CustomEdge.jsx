import { getBezierPath } from 'reactflow';
import { useStore } from '@/store/useStore';

/**
 * Custom edge component with a delete button that appears on hover.
 * Uses smoothstep/bezier path rendering with an interactive delete control.
 */
export const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) => {
  const deleteEdge = useStore((s) => s.deleteEdge);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <g className="group">
      {/* Invisible wider path for easier hover targeting */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        className="cursor-pointer"
      />
      {/* Visible edge path */}
      <path
        d={edgePath}
        fill="none"
        stroke="var(--edge-color)"
        strokeWidth={1.5}
        markerEnd={markerEnd}
        style={style}
        className="transition-all duration-150 group-hover:!stroke-[var(--node-purple)] group-hover:!stroke-[2px]"
      />
      {/* Delete button on hover */}
      <foreignObject
        width={20}
        height={20}
        x={labelX - 10}
        y={labelY - 10}
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 overflow-visible"
      >
        <button
          className="w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center text-[10px] font-bold cursor-pointer shadow-md border border-white transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            deleteEdge(id);
          }}
          title="Delete edge"
        >
          ×
        </button>
      </foreignObject>
    </g>
  );
};
