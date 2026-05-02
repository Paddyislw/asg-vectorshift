import { useState } from 'react';
import { cn } from '@/helpers/cn';

/**
 * Reusable tooltip component that shows on hover.
 * Supports positioning on any side of the trigger element.
 */
export const Tooltip = ({ children, content, position = 'top', className }) => {
  const [isVisible, setIsVisible] = useState(false);

  if (!content) return children;

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-zinc-700 border-x-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-zinc-700 border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-zinc-700 border-y-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-zinc-700 border-y-transparent border-l-transparent',
  };

  return (
    <div
      className={cn('relative inline-flex', className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={cn(
            'absolute z-50 pointer-events-none',
            positionClasses[position]
          )}
        >
          <div className="bg-zinc-700 text-white text-[10px] font-medium px-2 py-1 rounded shadow-lg whitespace-nowrap">
            {content}
            <div
              className={cn(
                'absolute w-0 h-0 border-4',
                arrowClasses[position]
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
};
