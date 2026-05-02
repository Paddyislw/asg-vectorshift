export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const GRID_SIZE = 20;

export const EDGE_CONFIG = {
  type: 'smoothstep',
  animated: true,
};

export const CANVAS_OPTIONS = {
  snapGrid: [GRID_SIZE, GRID_SIZE],
  connectionLineType: 'smoothstep',
  proOptions: { hideAttribution: true },
};
