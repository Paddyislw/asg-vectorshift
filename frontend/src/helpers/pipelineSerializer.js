/**
 * Serializes ReactFlow nodes and edges into the minimal format
 * expected by the /pipelines/parse endpoint.
 */
export function serializePipeline(nodes, edges) {
  return {
    nodes: nodes.map((node) => ({ id: node.id })),
    edges: edges.map((edge) => ({
      source: edge.source,
      target: edge.target,
    })),
  };
}

/**
 * Serializes the full pipeline state for saving/exporting.
 * Preserves all node data, positions, types, and edge details.
 */
export function serializeFullPipeline(nodes, edges) {
  return {
    nodes: nodes.map((node) => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: node.data,
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      type: edge.type,
      animated: edge.animated,
      markerEnd: edge.markerEnd,
    })),
  };
}

/**
 * Downloads pipeline data as a JSON file.
 */
export function exportPipelineAsJSON(nodes, edges, filename = 'pipeline') {
  const data = serializeFullPipeline(nodes, edges);
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Reads a JSON file and returns parsed pipeline data.
 */
export function importPipelineFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data.nodes || !data.edges) {
          reject(new Error('Invalid pipeline file'));
          return;
        }
        resolve(data);
      } catch {
        reject(new Error('Failed to parse pipeline file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
