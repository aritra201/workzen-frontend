import { formatShiftResponseKey } from '../../utils/shiftLabels.js';
import { SHIFT_CHIP_CLASS } from '../../utils/shiftChipStyles.js';
import StatusChip from './StatusChip.jsx';

const SHIFT_ORDER = ['day', 'night', 'extraDay', 'extraNight'];

function isShiftShownInAttendanceList(shift) {
  return Boolean(shift?.marked);
}

export function getActiveShiftResponseKeys(shifts) {
  return SHIFT_ORDER.filter((key) => isShiftShownInAttendanceList(shifts?.[key]));
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
          className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ${SHIFT_CHIP_CLASS[key] ?? 'bg-surface-container text-on-surface-variant'}`}
        >
          {formatShiftResponseKey(key)}
        </span>
      ))}
    </div>
  );
}
