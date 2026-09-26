import { formatShiftResponseKey } from '../../utils/shiftLabels.js';
import StatusChip from './StatusChip.jsx';

const SHIFT_ORDER = ['day', 'night', 'extraDay', 'extraNight'];

const HIGHLIGHT_CLASS = {
  day: 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/80',
  night: 'bg-blue-100 text-blue-800 ring-1 ring-blue-200/80',
  extraDay: 'bg-amber-100 text-amber-900 ring-1 ring-amber-200/80',
  extraNight: 'bg-orange-100 text-orange-900 ring-1 ring-orange-200/80',
};

export function getActiveShiftResponseKeys(shifts) {
  return SHIFT_ORDER.filter((key) => Boolean(shifts?.[key]));
}

export default function ShiftHighlightChips({ shifts, className = '' }) {
  const keys = getActiveShiftResponseKeys(shifts);

  if (!keys.length) {
    return <StatusChip tone="neutral">No shift</StatusChip>;
  }

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {keys.map((key) => (
        <span
          key={key}
          className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ${HIGHLIGHT_CLASS[key] ?? 'bg-surface-container text-on-surface-variant'}`}
        >
          {formatShiftResponseKey(key)}
        </span>
      ))}
    </div>
  );
}
