/** Stacked list rows for viewports below md (tables hidden on mobile). */
export function MobileListStack({ children, className = '' }) {
  return <ul className={`list-none space-y-3 p-0 md:hidden ${className}`}>{children}</ul>;
}

export function MobileListCard({ children, className = '' }) {
  return (
    <li
      className={`list-none rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-4 shadow-card ${className}`}
    >
      {children}
    </li>
  );
}
