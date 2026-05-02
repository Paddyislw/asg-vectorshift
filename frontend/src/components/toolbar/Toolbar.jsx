import { useState, useMemo } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon } from '@hugeicons/core-free-icons';
import { DraggableNode } from './DraggableNode';
import { NODE_CONFIGS } from '@/components/nodes/definitions';

export const PipelineToolbar = () => {
  const [search, setSearch] = useState('');

  const filteredNodes = useMemo(() => {
    if (!search.trim()) return NODE_CONFIGS;
    const query = search.toLowerCase();
    return NODE_CONFIGS.filter(
      (config) =>
        config.label.toLowerCase().includes(query) ||
        config.type.toLowerCase().includes(query)
    );
  }, [search]);

  return (
    <div className="bg-surface border-b border-surface-border px-5 py-3 shrink-0">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 mr-1 select-none">
          <img
            src="https://framerusercontent.com/images/mmHr0hfCho7PjYPw3BhcB5NhDOA.png"
            alt="VectorShift"
            className="w-6 h-6 object-contain"
          />
          <span className="text-node-xs font-semibold uppercase tracking-widest text-text-muted">
            VectorShift
          </span>
        </span>
        <div className="w-px h-5 bg-surface-border" />

        {/* Search */}
        <div className="relative">
          <HugeiconsIcon
            icon={Search01Icon}
            size={13}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search nodes..."
            className="bg-surface-card border border-surface-border rounded-lg pl-8 pr-3 py-1.5 text-node-xs text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-accent-purple-dark focus:ring-1 focus:ring-accent-purple-dark/30 transition-colors duration-fast w-[140px] focus:w-[180px]"
          />
        </div>

        <div className="w-px h-5 bg-surface-border" />

        <div className="flex flex-wrap items-center gap-2">
          {filteredNodes.length > 0 ? (
            filteredNodes.map((config) => (
              <DraggableNode
                key={config.type}
                type={config.type}
                label={config.label}
                icon={config.icon}
                accentColor={config.accentColor}
              />
            ))
          ) : (
            <span className="text-node-xs text-text-muted italic">
              No matching nodes
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
