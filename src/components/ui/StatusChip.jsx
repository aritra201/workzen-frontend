const styles = {
  verified:
    'border border-status-verified/30 bg-status-verified/10 text-status-verified dark:bg-status-verified/12',
  pending:
    'border border-status-pending/30 bg-status-pending/10 text-amber-900 dark:text-status-pending dark:bg-status-pending/12',
  rejected:
    'border border-status-denied/30 bg-status-denied/10 text-red-900 dark:text-status-denied dark:bg-status-denied/12',
  locked:
    'border border-outline-variant/50 bg-surface-container text-on-surface-variant',
  neutral:
    'border border-outline-variant/40 bg-surface-container text-on-surface-variant',
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
      className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide ${styles[tone]} ${className}`}
      style={{ fontFamily: 'var(--font-mono-numeric)' }}
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dots[tone]}`} />
      {children}
    </span>
  );
}
