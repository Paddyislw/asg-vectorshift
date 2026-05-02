import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from '@/store/useStore';
import { shallow } from 'zustand/shallow';
import { NODE_TYPES, NODE_CONFIGS } from '@/components/nodes/definitions';
import { GRID_SIZE, CANVAS_OPTIONS } from '@/constants';
import { ContextMenu } from '@/components/ui/ContextMenu';
import { CustomEdge } from './CustomEdge';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import 'reactflow/dist/style.css';

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  isValidConnection: state.isValidConnection,
  deleteNodeById: state.deleteNodeById,
  duplicateNodeById: state.duplicateNodeById,
});

const EDGE_TYPES = { default: CustomEdge };

const EmptyState = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
    <div className="text-center animate-fade-in">
      {/* Pipeline illustration */}
      <div className="flex items-center justify-center gap-3 mb-4 opacity-30">
        <div className="w-12 h-8 rounded-lg border-2 border-dashed border-text-muted/40" />
        <div className="w-8 border-t-2 border-dashed border-text-muted/40" />
        <div className="w-12 h-8 rounded-lg border-2 border-dashed border-text-muted/40" />
        <div className="w-8 border-t-2 border-dashed border-text-muted/40" />
        <div className="w-12 h-8 rounded-lg border-2 border-dashed border-text-muted/40" />
      </div>
      <p className="text-node-lg font-semibold text-text-muted/60">
        Drag nodes from the toolbar to get started
      </p>
      <p className="text-node-sm text-text-muted/40 mt-1">
        Connect nodes to build your pipeline
      </p>
      <div className="flex items-center justify-center gap-4 mt-4 text-node-xs text-text-muted/30">
        <span>Ctrl+Z Undo</span>
        <span>Ctrl+C Copy</span>
        <span>Ctrl+V Paste</span>
        <span>Del Delete</span>
      </div>
    </div>
  </div>
);

export const PipelineCanvas = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);

  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    isValidConnection,
    deleteNodeById,
    duplicateNodeById,
  } = useStore(selector, shallow);

  // Register keyboard shortcuts
  useKeyboardShortcuts();

  const getInitNodeData = (nodeID, type) => {
    const config = NODE_CONFIGS.find((c) => c.type === type);
    const defaults = config?.getDefaultData?.(nodeID) || {};
    return { id: nodeID, nodeType: type, ...defaults };
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const raw = event.dataTransfer.getData('application/reactflow');
      if (!raw) return;

      const { nodeType } = JSON.parse(raw);
      if (!nodeType) return;

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const nodeID = getNodeID(nodeType);
      const newNode = {
        id: nodeID,
        type: nodeType,
        position,
        data: getInitNodeData(nodeID, nodeType),
      };

      addNode(newNode);
    },
    [reactFlowInstance, getNodeID, addNode]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Right-click context menu
  const onNodeContextMenu = useCallback((event, node) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY, nodeId: node.id });
  }, []);

  const handleContextAction = useCallback(
    (action) => {
      if (!contextMenu?.nodeId) return;
      const nodeId = contextMenu.nodeId;

      switch (action) {
        case 'duplicate':
          duplicateNodeById(nodeId);
          break;
        case 'delete':
          deleteNodeById(nodeId);
          break;
      }
    },
    [contextMenu, deleteNodeById, duplicateNodeById]
  );

  // Close context menu on canvas click
  const onPaneClick = useCallback(() => {
    setContextMenu(null);
  }, []);

  const isEmpty = nodes.length === 0;

  return (
    <div ref={reactFlowWrapper} className="flex-1 w-full relative">
      {isEmpty && <EmptyState />}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        onNodeContextMenu={onNodeContextMenu}
        onPaneClick={onPaneClick}
        isValidConnection={isValidConnection}
        nodeTypes={NODE_TYPES}
        edgeTypes={EDGE_TYPES}
        defaultEdgeOptions={{
          type: 'default',
          animated: CANVAS_OPTIONS.animated,
        }}
        snapGrid={CANVAS_OPTIONS.snapGrid}
        connectionLineType={CANVAS_OPTIONS.connectionLineType}
        proOptions={CANVAS_OPTIONS.proOptions}
        deleteKeyCode={null}
      >
        <Background color="var(--canvas-dot)" gap={GRID_SIZE} />
        <Controls />
        <MiniMap />
      </ReactFlow>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onAction={handleContextAction}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
};
