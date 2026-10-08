export default function MarkedAttendanceOnlyField({ checked, onChange, disabled, className = '' }) {
  return (
    <label
      className={`flex min-h-12 cursor-pointer items-center gap-2 rounded-lg border border-outline-variant/40 bg-surface-container-low px-3 py-2 sm:min-w-[12rem] ${disabled ? 'cursor-not-allowed opacity-60' : ''} ${className}`}
    >
      <input
        type="checkbox"
        className="h-4 w-4 shrink-0 rounded border-outline-variant accent-primary"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="text-sm font-medium text-on-surface">Marked attendance only</span>
    </label>
  );
}
