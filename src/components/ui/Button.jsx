const variants = {
  primary:
    'bg-primary text-on-primary hover:bg-primary-container shadow-md active:scale-[0.99]',
  secondary:
    'bg-surface-container-lowest text-on-surface border border-outline-variant hover:bg-surface-container-low shadow-sm',
  ghost: 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface',
  danger: 'bg-error-container text-on-error-container hover:opacity-90',
  outline:
    'border border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-low',
};

const sizes = {
  md: 'h-12 px-4 text-sm font-semibold rounded-lg',
  sm: 'h-10 px-3 text-xs font-semibold rounded-lg',
  icon: 'h-10 w-10 rounded-xl flex items-center justify-center',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  disabled,
  children,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
