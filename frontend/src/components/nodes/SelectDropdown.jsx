import { useState, useRef, useEffect, useCallback } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon } from '@hugeicons/core-free-icons';

export const SelectDropdown = ({ options = [], value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = useCallback(
    (optValue) => {
      onChange(optValue);
      setIsOpen(false);
    },
    [onChange]
  );

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-2 bg-surface-card border border-surface-border rounded-lg px-2.5 py-1.5 text-node-sm text-text-primary cursor-pointer transition-colors duration-fast hover:border-accent-purple/50 focus:outline-none focus:border-accent-purple-dark focus:ring-1 focus:ring-accent-purple-dark/30"
      >
        <span className={selectedOption ? 'text-text-primary' : 'text-text-muted'}>
          {selectedOption?.label || placeholder || 'Select...'}
        </span>
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          size={14}
          className={`text-text-muted shrink-0 transition-transform duration-fast ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-surface border border-surface-border rounded-lg shadow-node-hover overflow-hidden animate-slide-up">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={`w-full text-left px-2.5 py-1.5 text-node-sm cursor-pointer transition-colors duration-fast ${
                  isSelected
                    ? 'bg-accent-purple/10 text-accent-purple-dark font-medium'
                    : 'text-text-primary hover:bg-surface-card'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
