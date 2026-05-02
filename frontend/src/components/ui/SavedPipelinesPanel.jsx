import { useState, useEffect, useCallback } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  FolderOpenIcon,
  Cancel01Icon,
  Delete02Icon,
  ArrowDown01Icon,
  PlayFreeIcons,
} from '@hugeicons/core-free-icons';
import { useStore } from '@/store/useStore';
import { shallow } from 'zustand/shallow';
import { listPipelines, getPipeline, deletePipeline } from '@/api/pipelines';
import toast from 'react-hot-toast';
import { cn } from '@/helpers/cn';

const selector = (state) => ({
  loadPipeline: state.loadPipeline,
});

/**
 * Slide-out panel showing saved pipelines.
 * Users can load or delete saved pipelines from here.
 */
export const SavedPipelinesPanel = ({ isOpen, onClose }) => {
  const { loadPipeline } = useStore(selector, shallow);
  const [pipelines, setPipelines] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPipelines = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await listPipelines();
      setPipelines(data);
    } catch {
      toast.error('Failed to load pipelines');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) fetchPipelines();
  }, [isOpen, fetchPipelines]);

  const handleLoad = async (id) => {
    try {
      const data = await getPipeline(id);
      loadPipeline({ nodes: data.nodes, edges: data.edges });
      toast.success(`Loaded "${data.name}"`);
      onClose();
    } catch {
      toast.error('Failed to load pipeline');
    }
  };

  const handleDelete = async (id, name) => {
    try {
      await deletePipeline(id);
      setPipelines((prev) => prev.filter((p) => p.id !== id));
      toast.success(`Deleted "${name}"`);
    } catch {
      toast.error('Failed to delete pipeline');
    }
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-[340px] bg-white border-l border-surface-border shadow-lg z-50 flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={FolderOpenIcon} size={16} className="text-accent-purple-dark" />
            <span className="text-node-sm font-semibold text-text-primary">
              Saved Pipelines
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-surface-card transition-colors cursor-pointer"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={16} className="text-text-muted" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-5 h-5 border-2 border-accent-purple border-t-transparent rounded-full animate-spin" />
            </div>
          ) : pipelines.length === 0 ? (
            <div className="text-center py-12">
              <HugeiconsIcon icon={FolderOpenIcon} size={32} className="text-text-muted/40 mx-auto mb-2" />
              <p className="text-node-sm text-text-muted">No saved pipelines</p>
              <p className="text-node-xs text-text-muted/60 mt-1">
                Save a pipeline using the button below
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {pipelines.map((p) => (
                <div
                  key={p.id}
                  className="bg-surface-card border border-surface-border rounded-lg p-3 hover:shadow-node transition-all duration-fast group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-node-sm font-semibold text-text-primary truncate">
                        {p.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-node-xs text-text-muted">
                          {p.node_count} nodes
                        </span>
                        <span className="text-node-xs text-text-muted">·</span>
                        <span className="text-node-xs text-text-muted">
                          {p.edge_count} edges
                        </span>
                      </div>
                      <p className="text-[10px] text-text-muted/60 mt-1">
                        {formatDate(p.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleLoad(p.id)}
                        className="p-1.5 rounded-lg hover:bg-accent-purple/10 transition-colors cursor-pointer"
                        title="Load pipeline"
                      >
                        <HugeiconsIcon icon={PlayFreeIcons} size={14} className="text-accent-purple-dark" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete pipeline"
                      >
                        <HugeiconsIcon icon={Delete02Icon} size={14} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
