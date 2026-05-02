import { useState, useRef } from 'react';
import {
  FloppyDiskIcon,
  FolderOpenIcon,
  ArrowDown01Icon,
  ArrowUp01Icon,
} from '@hugeicons/core-free-icons';
import { Button } from './Button';
import { useStore } from '@/store/useStore';
import { shallow } from 'zustand/shallow';
import { submitPipeline, savePipeline } from '@/api/pipelines';
import {
  serializePipeline,
  serializeFullPipeline,
  exportPipelineAsJSON,
  importPipelineFromFile,
} from '@/helpers/pipelineSerializer';
import { Modal } from './Modal';
import toast from 'react-hot-toast';

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  loadPipeline: state.loadPipeline,
});

export const SubmitButton = ({ onOpenSaved }) => {
  const { nodes, edges, loadPipeline } = useStore(selector, shallow);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [pipelineName, setPipelineName] = useState('');
  const importRef = useRef(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = serializePipeline(nodes, edges);
      const result = await submitPipeline(payload.nodes, payload.edges);

      toast.success(
        () => (
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-sm">Pipeline Analysis</span>
            <div className="flex items-center gap-3 text-xs text-gray-600">
              <span>{result.num_nodes} nodes</span>
              <span>{result.num_edges} edges</span>
              <span
                className={`font-medium px-1.5 py-0.5 rounded ${
                  result.is_dag
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {result.is_dag ? 'Valid DAG' : 'Has Cycles'}
              </span>
            </div>
          </div>
        ),
        { duration: 4000 }
      );
    } catch (err) {
      toast.error(err.message || 'Failed to submit pipeline');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openSaveModal = () => {
    if (nodes.length === 0) {
      toast.error('Nothing to save');
      return;
    }
    setPipelineName('');
    setSaveModalOpen(true);
  };

  const handleSave = async () => {
    if (!pipelineName.trim()) return;

    setIsSaving(true);
    try {
      const { nodes: serializedNodes, edges: serializedEdges } =
        serializeFullPipeline(nodes, edges);
      await savePipeline(pipelineName.trim(), serializedNodes, serializedEdges);
      toast.success(`Saved "${pipelineName.trim()}"`);
      setSaveModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    if (nodes.length === 0) {
      toast.error('Nothing to export');
      return;
    }
    exportPipelineAsJSON(nodes, edges);
    toast.success('Pipeline exported');
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await importPipelineFromFile(file);
      loadPipeline(data);
      toast.success('Pipeline imported');
    } catch (err) {
      toast.error(err.message || 'Failed to import');
    }

    // Reset input so same file can be re-imported
    e.target.value = '';
  };

  const connectedNodes = new Set();
  edges.forEach((e) => {
    connectedNodes.add(e.source);
    connectedNodes.add(e.target);
  });
  const disconnectedCount = nodes.filter((n) => !connectedNodes.has(n.id)).length;

  return (
    <>
    <div className="bg-surface border-t border-surface-border px-5 py-2.5 flex items-center justify-between shrink-0">
      {/* Left: Stats */}
      <div className="flex items-center gap-3">
        <span className="text-node-xs text-text-muted">
          {nodes.length} node{nodes.length !== 1 ? 's' : ''}
        </span>
        <span className="text-node-xs text-text-muted">·</span>
        <span className="text-node-xs text-text-muted">
          {edges.length} edge{edges.length !== 1 ? 's' : ''}
        </span>
        {disconnectedCount > 0 && (
          <>
            <span className="text-node-xs text-text-muted">·</span>
            <span className="text-node-xs text-amber-500 font-medium">
              {disconnectedCount} unconnected
            </span>
          </>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Import (hidden input) */}
        <input
          ref={importRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />

        <Button icon={ArrowUp01Icon} onClick={() => importRef.current?.click()} title="Import pipeline from JSON">
          Import
        </Button>

        <Button icon={ArrowDown01Icon} onClick={handleExport} title="Export pipeline as JSON">
          Export
        </Button>

        <div className="w-px h-5 bg-surface-border" />

        <Button icon={FolderOpenIcon} onClick={onOpenSaved} title="View saved pipelines">
          Load
        </Button>

        <Button icon={FloppyDiskIcon} onClick={openSaveModal} title="Save pipeline">
          Save
        </Button>

        <div className="w-px h-5 bg-surface-border" />

        <Button
          variant="primary"
          size="lg"
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Pipeline'}
        </Button>
      </div>
    </div>

    <Modal
      isOpen={saveModalOpen}
      onClose={() => setSaveModalOpen(false)}
      title="Save Pipeline"
    >
      <div className="flex flex-col gap-3">
        <div>
          <label className="text-node-xs font-medium text-text-secondary uppercase tracking-wide block mb-1.5">
            Pipeline Name
          </label>
          <input
            type="text"
            value={pipelineName}
            onChange={(e) => setPipelineName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
            }}
            placeholder="My Pipeline"
            className="w-full bg-surface-card border border-surface-border rounded-lg px-3 py-2 text-node-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-purple-dark focus:ring-1 focus:ring-accent-purple-dark/30 transition-colors duration-fast"
          />
        </div>
        <div className="flex items-center gap-2 justify-end pt-1">
          <Button size="md" onClick={() => setSaveModalOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleSave}
            disabled={isSaving || !pipelineName.trim()}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </Modal>
    </>
  );
};
