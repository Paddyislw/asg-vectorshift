import { API_BASE_URL } from '@/constants';

/**
 * Submits a pipeline to the backend for DAG analysis.
 */
export async function submitPipeline(nodes, edges) {
  const response = await fetch(`${API_BASE_URL}/pipelines/parse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nodes, edges }),
  });

  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }

  return response.json();
}

/**
 * Saves a pipeline to the backend.
 */
export async function savePipeline(name, nodes, edges) {
  const response = await fetch(`${API_BASE_URL}/pipelines/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, nodes, edges }),
  });

  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }

  return response.json();
}

/**
 * Fetches all saved pipelines (summaries only).
 */
export async function listPipelines() {
  const response = await fetch(`${API_BASE_URL}/pipelines`);

  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }

  return response.json();
}

/**
 * Fetches a single pipeline with full node/edge data.
 */
export async function getPipeline(id) {
  const response = await fetch(`${API_BASE_URL}/pipelines/${id}`);

  if (!response.ok) {
    throw new Error(`Pipeline not found`);
  }

  return response.json();
}

/**
 * Deletes a saved pipeline.
 */
export async function deletePipeline(id) {
  const response = await fetch(`${API_BASE_URL}/pipelines/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }

  return response.json();
}
