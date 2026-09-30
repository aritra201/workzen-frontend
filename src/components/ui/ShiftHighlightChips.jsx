import { isHalfShiftKey } from '../../utils/halfShifts.js';
import { formatShiftResponseKey } from '../../utils/shiftLabels.js';
import { shiftChipClassName } from '../../utils/shiftChipStyles.js';
import StatusChip from './StatusChip.jsx';

const SHIFT_ORDER = ['day', 'night', 'extraDay', 'extraNight'];

function isShiftShownInAttendanceList(shift) {
  return Boolean(shift?.marked);
}

export function getActiveShiftResponseKeys(shifts) {
  const fixed = SHIFT_ORDER.filter((key) => isShiftShownInAttendanceList(shifts?.[key]));
  const halfFromArray = (shifts?.halfShifts || [])
    .filter((h) => h?.marked && h.shiftKey)
    .map((h) => h.shiftKey);
  const halfFromObject = Object.keys(shifts || {}).filter(
    (key) => isHalfShiftKey(key) && isShiftShownInAttendanceList(shifts[key])
  );
  const half = [...new Set([...halfFromArray, ...halfFromObject])];
  return [...fixed, ...half];
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
          className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ${shiftChipClassName(key)}`}
        >
          {formatShiftResponseKey(key)}
        </span>
      ))}
    </div>
  );
}
