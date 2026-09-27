import PersonAvatar from '../ui/PersonAvatar.jsx';
import ShiftHighlightChips from '../ui/ShiftHighlightChips.jsx';
import StatusChip from '../ui/StatusChip.jsx';

export function isExtraDeclared(slot) {
  return Boolean(slot?.declared);
}

/** Chips input: only declared extra shifts (not regular day/night). */
export function declaredExtraShiftsForRow(row) {
  const shifts = {};
  if (isExtraDeclared(row?.extraDay)) {
    shifts.extraDay = row.extraDay;
  }
  if (isExtraDeclared(row?.extraNight)) {
    shifts.extraNight = row.extraNight;
  }
  return shifts;
}

function rowAttendanceStatus(row) {
  const slots = [row?.extraDay, row?.extraNight].filter(isExtraDeclared);
  if (!slots.length) {
    return { label: '—', tone: 'neutral' };
  }
  if (slots.every((s) => s.fulfilled)) {
    return { label: 'Fulfilled', tone: 'verified' };
  }
  if (slots.some((s) => s.fulfilled)) {
    return { label: 'Partially fulfilled', tone: 'pending' };
  }
  return { label: 'Awaiting attendance', tone: 'pending' };
}

export default function ExtraShiftDeclarationsTable({ rows, date, emptyMessage }) {
  return (
    <div className="overflow-hidden rounded-lg border border-outline-variant/40 bg-surface-container-lowest shadow-card">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-outline-variant/40 bg-surface-container-low">
          <tr>
            <th className="label-caps px-3 py-2 text-outline">Employee</th>
            <th className="label-caps px-3 py-2 text-outline">Extra shifts</th>
            <th className="label-caps px-3 py-2 text-outline">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-4 py-10 text-center text-on-surface-variant">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => {
              const status = rowAttendanceStatus(row);
              const shiftChips = declaredExtraShiftsForRow(row);
              return (
                <tr
                  key={`${row.employeeId}-${date}`}
                  className="border-t border-outline-variant/30 hover:bg-surface-container-high/50"
                >
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-3">
                      <PersonAvatar
                        name={row.employeeName}
                        email={row.employeeEmail}
                        size={40}
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-on-surface">{row.employeeName || '—'}</p>
                        <p className="truncate text-xs text-on-surface-variant">{row.employeeEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <ShiftHighlightChips shifts={shiftChips} includeDeclaredExtras />
                  </td>
                  <td className="px-3 py-2.5">
                    <StatusChip tone={status.tone}>{status.label}</StatusChip>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
