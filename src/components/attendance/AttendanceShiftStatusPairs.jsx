import { getAttendanceShiftStatusEntries } from '../../utils/companyAttendanceList.js';
import { SHIFT_CHIP_CLASS } from '../../utils/shiftChipStyles.js';
import StatusChip from '../ui/StatusChip.jsx';

const SHIFT_ORDER = ['day', 'night', 'extraDay', 'extraNight'];

export default function AttendanceShiftStatusPairs({
  shifts,
  entries: entriesProp,
  emptyLabel = 'Not marked attendance',
  className = '',
}) {
  const entries = (entriesProp ?? getAttendanceShiftStatusEntries(shifts)).sort(
    (a, b) => SHIFT_ORDER.indexOf(a.responseKey) - SHIFT_ORDER.indexOf(b.responseKey)
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
            className={`inline-flex min-w-[5.5rem] w-fit shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold ${SHIFT_CHIP_CLASS[entry.responseKey] ?? 'bg-surface-container text-on-surface-variant'}`}
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
