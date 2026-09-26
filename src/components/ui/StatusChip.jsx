const styles = {
  verified: 'bg-emerald-50 text-emerald-800',
  pending: 'bg-amber-50 text-amber-900',
  rejected: 'bg-red-50 text-red-900',
  locked: 'bg-slate-100 text-slate-600',
  neutral: 'bg-surface-container text-on-surface-variant',
};

const dots = {
  verified: 'bg-status-verified',
  pending: 'bg-status-pending',
  rejected: 'bg-status-denied',
  locked: 'bg-status-locked',
  neutral: 'bg-outline',
};

export default function StatusChip({ tone = 'neutral', children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${styles[tone]} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dots[tone]}`} />
      {children}
    </span>
  );
}
