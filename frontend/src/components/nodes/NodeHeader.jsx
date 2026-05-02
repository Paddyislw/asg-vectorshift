import { HugeiconsIcon } from '@hugeicons/react';

export const NodeHeader = ({ icon, label, accentColor }) => {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-surface-header rounded-t-card border-b border-surface-border">
      {icon && (
        <span
          className="flex items-center justify-center w-5 h-5 rounded shrink-0"
          style={{ backgroundColor: `${accentColor}20` }}
        >
          <HugeiconsIcon icon={icon} size={12} style={{ color: accentColor }} />
        </span>
      )}
      <span className="text-node-sm font-semibold text-text-primary truncate">
        {label}
      </span>
    </div>
  );
};
