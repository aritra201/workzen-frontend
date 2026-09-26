export default function SelectField({
  id,
  label,
  hint,
  error,
  className = '',
  children,
  ...selectProps
}) {
  return (
    <label className={`block ${className}`} htmlFor={id}>
      {label ? (
        <span className="mb-1.5 block text-xs font-medium text-on-surface">{label}</span>
      ) : null}
      <select
        id={id}
        className="h-12 w-full rounded-lg bg-surface-container-low px-3 text-on-surface focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_#00685f] focus:outline-none"
        {...selectProps}
      >
        {children}
      </select>
      {error ? <p className="mt-1 text-xs text-error">{error}</p> : null}
      {hint && !error ? <p className="mt-1 text-xs text-on-surface-variant">{hint}</p> : null}
    </label>
  );
}
