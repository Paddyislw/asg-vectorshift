import { useEffect, useRef } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Delete02Icon,
  Copy02Icon,
} from '@hugeicons/core-free-icons';
import { cn } from '@/helpers/cn';

const MENU_ITEMS = [
  { id: 'duplicate', label: 'Duplicate', icon: Copy02Icon, shortcut: 'Ctrl+D' },
  { id: 'delete', label: 'Delete', icon: Delete02Icon, shortcut: 'Del', danger: true },
];

/**
 * Context menu that appears on right-click on a node.
 * Positioned at the click coordinates and auto-closes on outside click.
 */
export const ContextMenu = ({ x, y, onAction, onClose }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white border border-surface-border rounded-xl shadow-lg py-1 min-w-[180px] animate-fade-in"
      style={{ top: y, left: x }}
    >
      {MENU_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => {
            onAction(item.id);
            onClose();
          }}
          className={cn(
            'w-full flex items-center gap-2.5 px-3 py-2 text-node-sm transition-colors duration-fast text-left',
            item.danger
              ? 'text-red-600 hover:bg-red-50'
              : 'text-text-primary hover:bg-surface-card'
          )}
        >
          <HugeiconsIcon icon={item.icon} size={14} />
          <span className="flex-1">{item.label}</span>
          <span className="text-[10px] text-text-muted font-mono">
            {item.shortcut}
          </span>
        </button>
      ))}
    </div>
  );
};
