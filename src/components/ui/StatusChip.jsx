import { SHIFT_CHIP_CLASS, SHIFT_CHIP_DOT_CLASS, STATUS_TONE_SHIFT_KEY } from '../../utils/shiftChipStyles.js';

function shiftAlignedStatusStyle(tone) {
  const shiftKey = STATUS_TONE_SHIFT_KEY[tone];
  if (!shiftKey) {
    return null;
  }
  return SHIFT_CHIP_CLASS[shiftKey];
}

function shiftAlignedDotStyle(tone) {
  const shiftKey = STATUS_TONE_SHIFT_KEY[tone];
  if (!shiftKey) {
    return null;
  }
  return SHIFT_CHIP_DOT_CLASS[shiftKey];
}

const styles = {
  rejected:
    'border border-red-200/80 bg-red-100 text-red-800 ring-1 ring-red-200/80 dark:border-status-denied/30 dark:bg-status-denied/12 dark:text-status-denied',
  notMarked:
    'border border-slate-200/80 bg-slate-100 text-slate-600 ring-1 ring-slate-200/80 dark:border-outline-variant/50 dark:bg-surface-container dark:text-on-surface-variant',
  locked:
    'border border-outline-variant/50 bg-surface-container text-on-surface-variant',
  neutral:
    'border border-outline-variant/40 bg-surface-container text-on-surface-variant',
};

const dots = {
  rejected: 'bg-red-600 dark:bg-status-denied',
  notMarked: 'bg-slate-400 dark:bg-outline',
  locked: 'bg-status-locked',
  neutral: 'bg-outline',
};

export default function StatusChip({ tone = 'neutral', children, className = '' }) {
  const shiftStyle = shiftAlignedStatusStyle(tone);
  const toneStyle = shiftStyle ?? styles[tone] ?? styles.neutral;
  const dotStyle = shiftAlignedDotStyle(tone) ?? dots[tone] ?? dots.neutral;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide ${toneStyle} ${className}`}
      style={{ fontFamily: 'var(--font-mono-numeric)' }}
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotStyle}`} />
      {children}
    </span>
  );
}
