/** Inline spinner for buttons (inherits current text color). */
export default function ButtonSpinner({ className = '' }) {
  return (
    <span
      className={`inline-block h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
      aria-hidden
    />
  );
}
