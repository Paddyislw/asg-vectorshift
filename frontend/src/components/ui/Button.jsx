import { HugeiconsIcon } from '@hugeicons/react';
import clsx from 'clsx';

const VARIANTS = {
  primary:
    'bg-button-dark text-text-on-dark font-semibold hover:opacity-90 active:scale-[0.98] shadow-panel',
  ghost:
    'bg-surface border border-surface-border text-text-secondary font-medium hover:bg-surface-card',
};

const SIZES = {
  sm: 'px-3 py-2 text-node-xs gap-1.5',
  md: 'px-4 py-2 text-node-sm gap-2',
  lg: 'px-8 py-2 text-node-sm gap-2',
  icon: 'w-9 h-9',
};

export const Button = ({
  variant = 'ghost',
  size = 'sm',
  icon,
  children,
  className,
  disabled,
  ...props
}) => {
  const isIconOnly = size === 'icon';

  return (
    <button
      disabled={disabled}
      className={clsx(
        'inline-flex items-center justify-center rounded-full',
        'transition-all duration-fast cursor-pointer',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {icon && <HugeiconsIcon icon={icon} size={isIconOnly ? 16 : 13} />}
      {!isIconOnly && children}
    </button>
  );
};