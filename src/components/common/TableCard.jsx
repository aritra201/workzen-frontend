/** Table wrapper — hidden on mobile; use MobileList* for small screens. */
export default function TableCard({
  className = '',
  minTableWidth = 'md:min-w-[40rem]',
  bordered = true,
  children,
}) {
  const borderClass = bordered ? 'border border-outline-variant/40' : '';
  return (
    <div
      className={`hidden w-full min-w-0 max-w-full md:block ${borderClass} bg-surface-container-lowest shadow-card ${className}`}
    >
      <div className="w-full min-w-0 overflow-x-auto overscroll-x-contain">
        <table className={`w-full text-left text-sm ${minTableWidth}`}>{children}</table>
      </div>
    </div>
  );
}
