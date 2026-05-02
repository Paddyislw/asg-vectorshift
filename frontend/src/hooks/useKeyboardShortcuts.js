import { useEffect } from 'react';
import { useStore } from '@/store/useStore';

/**
 * Hook that registers global keyboard shortcuts for the pipeline canvas.
 * Shortcuts are only active when not typing in an input/textarea.
 */
export function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = e.target.tagName;
      const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
      const isMeta = e.metaKey || e.ctrlKey;

      // Don't intercept shortcuts when typing in form fields
      if (isInput && !isMeta) return;

      const store = useStore.getState();

      // Ctrl/Cmd + Z → Undo
      if (isMeta && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        store.undo();
        return;
      }

      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y → Redo
      if ((isMeta && e.key === 'z' && e.shiftKey) || (isMeta && e.key === 'y')) {
        e.preventDefault();
        store.redo();
        return;
      }

      // Ctrl/Cmd + C → Copy
      if (isMeta && e.key === 'c' && !isInput) {
        e.preventDefault();
        store.copySelectedNodes();
        return;
      }

      // Ctrl/Cmd + V → Paste
      if (isMeta && e.key === 'v' && !isInput) {
        e.preventDefault();
        store.pasteNodes();
        return;
      }

      // Ctrl/Cmd + D → Duplicate
      if (isMeta && e.key === 'd' && !isInput) {
        e.preventDefault();
        store.duplicateSelectedNodes();
        return;
      }

      // Ctrl/Cmd + A → Select All
      if (isMeta && e.key === 'a' && !isInput) {
        e.preventDefault();
        store.selectAll();
        return;
      }

      // Delete / Backspace → Delete selected
      if ((e.key === 'Delete' || e.key === 'Backspace') && !isInput) {
        e.preventDefault();
        store.deleteSelectedNodes();
        store.deleteSelectedEdges();
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
}
