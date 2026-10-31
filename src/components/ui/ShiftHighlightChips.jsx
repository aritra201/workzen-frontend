import { formatShiftResponseKey } from '../../utils/shiftLabels.js';
import { shiftChipClassName } from '../../utils/shiftChipStyles.js';
import StatusChip from './StatusChip.jsx';

const SHIFT_ORDER = ['day', 'night', 'extraDay', 'extraNight', 'halfShiftDay', 'halfShiftNight'];

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
          className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ${shiftChipClassName(key)}`}
        >
          {formatShiftResponseKey(key)}
        </span>
      ))}
    </div>
  );
}
