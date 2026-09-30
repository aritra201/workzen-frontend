import { getAttendanceShiftStatusEntries } from '../../utils/companyAttendanceList.js';
import { parseHalfShiftSlot } from '../../utils/halfShifts.js';
import { shiftChipClassName } from '../../utils/shiftChipStyles.js';
import StatusChip from '../ui/StatusChip.jsx';

const SHIFT_ORDER = ['day', 'night', 'extraDay', 'extraNight'];

function shiftEntrySortIndex(responseKey) {
  const fixedIdx = SHIFT_ORDER.indexOf(responseKey);
  if (fixedIdx >= 0) {
    return fixedIdx;
  }
  const halfSlot = parseHalfShiftSlot(responseKey);
  if (halfSlot) {
    return SHIFT_ORDER.length + halfSlot - 1;
  }
  return SHIFT_ORDER.length + 10;
}

export default function AttendanceShiftStatusPairs({
  shifts,
  entries: entriesProp,
  emptyLabel = 'Not marked attendance',
  className = '',
}) {
  const entries = (entriesProp ?? getAttendanceShiftStatusEntries(shifts)).sort(
    (a, b) => shiftEntrySortIndex(a.responseKey) - shiftEntrySortIndex(b.responseKey)
  );

  if (!entries.length) {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <span className="min-w-[5.5rem] shrink-0 text-xs text-on-surface-variant">—</span>
        <StatusChip tone="notMarked" className="w-fit max-w-full">
          {emptyLabel}
        </StatusChip>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {entries.map((entry) => (
        <div key={entry.responseKey} className="flex flex-wrap items-center gap-2 sm:gap-4">
          <span
            className={`inline-flex min-w-[5.5rem] w-fit shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold ${shiftChipClassName(entry.responseKey)}`}
          >
            {entry.shiftLabel}
          </span>
          <StatusChip tone={entry.tone} className="w-fit max-w-full shrink-0">
            {entry.label}
          </StatusChip>
        </div>
      ))}
    </div>
  );
}
