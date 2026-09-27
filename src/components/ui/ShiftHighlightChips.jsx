import { formatShiftResponseKey } from '../../utils/shiftLabels.js';
import { SHIFT_CHIP_CLASS } from '../../utils/shiftChipStyles.js';
import StatusChip from './StatusChip.jsx';

const SHIFT_ORDER = ['day', 'night', 'extraDay', 'extraNight'];

function isShiftShownInAttendanceList(key, shift) {
  if (!shift) {
    return false;
  }
  if (key === 'extraDay' || key === 'extraNight') {
    return Boolean(shift.declared && shift.marked);
  }
  return Boolean(shift.marked);
}

/** @param {{ includeDeclaredExtras?: boolean }} options */
export function getActiveShiftResponseKeys(shifts, options = {}) {
  const { includeDeclaredExtras = false } = options;
  return SHIFT_ORDER.filter((key) => {
    const shift = shifts?.[key];
    if (!shift) {
      return false;
    }
    if (includeDeclaredExtras && (key === 'extraDay' || key === 'extraNight')) {
      return Boolean(shift.declared);
    }
    return isShiftShownInAttendanceList(key, shift);
  });
}

export default function ShiftHighlightChips({ shifts, includeDeclaredExtras = false, className = '' }) {
  const keys = getActiveShiftResponseKeys(shifts, { includeDeclaredExtras });

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
