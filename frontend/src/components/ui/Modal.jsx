import { useEffect, useRef } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon } from '@hugeicons/core-free-icons';

export const Modal = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus the modal when it opens
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const input = modalRef.current.querySelector('input, textarea');
      if (input) input.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          ref={modalRef}
          className="bg-white rounded-2xl shadow-lg border border-surface-border w-full max-w-[400px] pointer-events-auto animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border">
            <h3 className="text-node-base font-semibold text-text-primary">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-surface-card transition-colors cursor-pointer"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={16} className="text-text-muted" />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-4">{children}</div>
        </div>
      </div>
    </>
  );
};