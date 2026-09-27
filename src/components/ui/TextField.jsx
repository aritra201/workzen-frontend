import Icon from './Icon.jsx';

export default function TextField({
  label,
  id,
  icon,
  hint,
  error,
  className = '',
  inputClassName = '',
  suffix,
  ...inputProps
}) {
  const paddingRight = suffix ? 'pr-11' : 'pr-4';

  return (
    <label className={`block ${className}`} htmlFor={id}>
      {label ? (
        <span className="mb-1.5 block text-xs font-medium text-on-surface">{label}</span>
      ) : null}
      <div className="relative flex items-center">
        {icon ? (
          <Icon
            name={icon}
            className="pointer-events-none absolute left-3.5 z-[1] text-on-surface-variant"
            size={20}
          />
        ) : null}
        <input
          id={id}
          className={`h-12 w-full max-w-full rounded-lg border border-outline-variant/40 bg-surface-container-lowest text-base text-on-surface placeholder:text-on-surface-variant/60 focus:shadow-[0_0_0_2px_#00685f] focus:outline-none transition-all md:text-sm ${icon ? `pl-11 ${paddingRight}` : `px-4 ${suffix ? 'pr-11' : ''}`} ${inputClassName}`}
          {...inputProps}
        />
        {suffix}
      </div>
      {error ? <p className="mt-1 text-xs text-error">{error}</p> : null}
      {hint && !error ? <p className="mt-1 text-xs text-on-surface-variant">{hint}</p> : null}
    </label>
  );
}
