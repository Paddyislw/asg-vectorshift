import { create } from 'zustand';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from 'reactflow';
import { EDGE_CONFIG } from '@/constants';

const MAX_HISTORY = 50;
const PASTE_OFFSET = { x: 50, y: 50 };

export const useStore = create((set, get) => ({
  nodes: [],
  edges: [],
  nodeIDs: {},

  // ── History (undo/redo) ──
  past: [],
  future: [],

  // ── Clipboard (copy/paste) ──
  clipboard: null,

  /**
   * Saves a snapshot of the current state before a mutating action.
   * Called internally by actions that should be undoable.
   */
  _takeSnapshot: () => {
    const { nodes, edges, past } = get();
    const snapshot = {
      nodes: structuredClone(nodes),
      edges: structuredClone(edges),
    };
    set({
      past: [...past.slice(-MAX_HISTORY), snapshot],
      future: [],
    });
  },

  undo: () => {
    const { past, nodes, edges } = get();
    if (past.length === 0) return;

    const previous = past[past.length - 1];
    const current = {
      nodes: structuredClone(nodes),
      edges: structuredClone(edges),
    };

    set({
      nodes: previous.nodes,
      edges: previous.edges,
      past: past.slice(0, -1),
      future: [...get().future, current],
    });
  },

  redo: () => {
    const { future, nodes, edges } = get();
    if (future.length === 0) return;

    const next = future[future.length - 1];
    const current = {
      nodes: structuredClone(nodes),
      edges: structuredClone(edges),
    };

    set({
      nodes: next.nodes,
      edges: next.edges,
      future: future.slice(0, -1),
      past: [...get().past, current],
    });
  },

  // ── Node ID Management ──
  getNodeID: (type) => {
    const newIDs = { ...get().nodeIDs };
    if (newIDs[type] === undefined) {
      newIDs[type] = 0;
    }
    newIDs[type] += 1;
    set({ nodeIDs: newIDs });
    return `${type}-${newIDs[type]}`;
  },

  // ── Core Actions ──
  addNode: (node) => {
    get()._takeSnapshot();
    set({ nodes: [...get().nodes, node] });
  },

  onNodesChange: (changes) => {
    // Snapshot only on removals (not on drags/selections)
    const hasRemovals = changes.some((c) => c.type === 'remove');
    if (hasRemovals) get()._takeSnapshot();

    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },

  onEdgesChange: (changes) => {
    const hasRemovals = changes.some((c) => c.type === 'remove');
    if (hasRemovals) get()._takeSnapshot();

    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  onConnect: (connection) => {
    get()._takeSnapshot();
    set({
      edges: addEdge(
        {
          ...connection,
          type: EDGE_CONFIG.type,
          animated: EDGE_CONFIG.animated,
          markerEnd: {
            type: MarkerType.Arrow,
            height: '20px',
            width: '20px',
          },
        },
        get().edges
      ),
    });
  },

  updateNodeField: (nodeId, fieldName, fieldValue) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, [fieldName]: fieldValue } };
        }
        return node;
      }),
    });
  },

  // ── Connection Validation ──
  isValidConnection: (connection) => {
    const { edges } = get();

    // Prevent self-connections
    if (connection.source === connection.target) return false;

    // Prevent duplicate connections
    const isDuplicate = edges.some(
      (e) =>
        e.source === connection.source &&
        e.target === connection.target &&
        e.sourceHandle === connection.sourceHandle &&
        e.targetHandle === connection.targetHandle
    );
    if (isDuplicate) return false;

    // Prevent connecting to the same target handle twice
    const targetBusy = edges.some(
      (e) =>
        e.target === connection.target &&
        e.targetHandle === connection.targetHandle
    );
    if (targetBusy) return false;

    return true;
  },

  // ── Copy/Paste ──
  copySelectedNodes: () => {
    const { nodes, edges } = get();
    const selectedNodes = nodes.filter((n) => n.selected);
    if (selectedNodes.length === 0) return;

    const selectedIds = new Set(selectedNodes.map((n) => n.id));
    const connectedEdges = edges.filter(
      (e) => selectedIds.has(e.source) && selectedIds.has(e.target)
    );

    set({
      clipboard: {
        nodes: structuredClone(selectedNodes),
        edges: structuredClone(connectedEdges),
      },
    });
  },

  pasteNodes: () => {
    const { clipboard, getNodeID } = get();
    if (!clipboard || clipboard.nodes.length === 0) return;

    get()._takeSnapshot();

    // Map old IDs to new IDs
    const idMap = {};
    const newNodes = clipboard.nodes.map((node) => {
      const newId = getNodeID(node.type);
      idMap[node.id] = newId;
      return {
        ...structuredClone(node),
        id: newId,
        position: {
          x: node.position.x + PASTE_OFFSET.x,
          y: node.position.y + PASTE_OFFSET.y,
        },
        selected: true,
        data: { ...structuredClone(node.data), id: newId },
      };
    });

    // Remap edge source/target to new IDs
    const newEdges = clipboard.edges
      .filter((e) => idMap[e.source] && idMap[e.target])
      .map((edge) => ({
        ...structuredClone(edge),
        id: `e-${idMap[edge.source]}-${idMap[edge.target]}-${Date.now()}`,
        source: idMap[edge.source],
        target: idMap[edge.target],
        sourceHandle: edge.sourceHandle?.replace(edge.source, idMap[edge.source]),
        targetHandle: edge.targetHandle?.replace(edge.target, idMap[edge.target]),
      }));

    // Deselect existing nodes
    const deselected = get().nodes.map((n) => ({ ...n, selected: false }));

    set({
      nodes: [...deselected, ...newNodes],
      edges: [...get().edges, ...newEdges],
    });
  },

  // ── Duplicate Selected ──
  duplicateSelectedNodes: () => {
    get().copySelectedNodes();
    get().pasteNodes();
  },

  // ── Delete Selected ──
  deleteSelectedNodes: () => {
    const { nodes, edges } = get();
    const selected = nodes.filter((n) => n.selected);
    if (selected.length === 0) return;

    get()._takeSnapshot();
    const selectedIds = new Set(selected.map((n) => n.id));
    set({
      nodes: nodes.filter((n) => !selectedIds.has(n.id)),
      edges: edges.filter(
        (e) => !selectedIds.has(e.source) && !selectedIds.has(e.target)
      ),
    });
  },

  // ── Delete Selected Edges ──
  deleteSelectedEdges: () => {
    const { edges } = get();
    const selected = edges.filter((e) => e.selected);
    if (selected.length === 0) return;

    get()._takeSnapshot();
    set({ edges: edges.filter((e) => !e.selected) });
  },

  // ── Delete Node by ID ──
  deleteNodeById: (nodeId) => {
    const { nodes, edges } = get();
    get()._takeSnapshot();
    set({
      nodes: nodes.filter((n) => n.id !== nodeId),
      edges: edges.filter(
        (e) => e.source !== nodeId && e.target !== nodeId
      ),
    });
  },

  // ── Duplicate Node by ID ──
  duplicateNodeById: (nodeId) => {
    const { nodes, getNodeID } = get();
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    get()._takeSnapshot();

    const newId = getNodeID(node.type);
    const newNode = {
      ...structuredClone(node),
      id: newId,
      position: {
        x: node.position.x + PASTE_OFFSET.x,
        y: node.position.y + PASTE_OFFSET.y,
      },
      selected: true,
      data: { ...structuredClone(node.data), id: newId },
    };

    // Deselect all, select the new one
    const deselected = nodes.map((n) => ({ ...n, selected: false }));

    set({
      nodes: [...deselected, newNode],
    });
  },

  // ── Delete Edge by ID ──
  deleteEdge: (edgeId) => {
    get()._takeSnapshot();
    set({ edges: get().edges.filter((e) => e.id !== edgeId) });
  },

  // ── Select All ──
  selectAll: () => {
    set({
      nodes: get().nodes.map((n) => ({ ...n, selected: true })),
      edges: get().edges.map((e) => ({ ...e, selected: true })),
    });
  },

  // ── Clear Canvas ──
  clearCanvas: () => {
    get()._takeSnapshot();
    set({ nodes: [], edges: [] });
  },

  // ── Load Pipeline (from saved data) ──
  loadPipeline: (pipelineData) => {
    get()._takeSnapshot();

    // Rebuild nodeIDs counter from loaded nodes
    const newIDs = {};
    pipelineData.nodes.forEach((node) => {
      const parts = node.id.split('-');
      const num = parseInt(parts[parts.length - 1], 10);
      const type = parts.slice(0, -1).join('-');
      if (!newIDs[type] || num > newIDs[type]) {
        newIDs[type] = num;
      }
    });

    set({
      nodes: pipelineData.nodes,
      edges: pipelineData.edges,
      nodeIDs: newIDs,
    });
  },
}));
