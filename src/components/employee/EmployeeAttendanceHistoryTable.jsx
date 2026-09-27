import { Link } from 'react-router-dom';
import { sumShiftAmounts } from '../../utils/myAttendanceList.js';
import AttendanceShiftStatusPairs from '../attendance/AttendanceShiftStatusPairs.jsx';
import StatusChip from '../ui/StatusChip.jsx';
import { formatCurrencyInr, formatDateLabel } from '../../utils/format.js';
import Button from '../ui/Button.jsx';

export default function EmployeeAttendanceHistoryTable({
  records,
  detailBasePath,
  emptyMessage = 'No attendance records in this range.',
  showUnlockAction,
  pendingAttendanceIds,
  onRequestUnlock,
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-outline-variant/40 bg-surface-container-lowest shadow-card">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-outline-variant/40 bg-surface-container-low">
          <tr>
            <th className="label-caps px-3 py-2 text-outline">Date</th>
            <th className="label-caps min-w-[14rem] px-3 py-2 text-outline">
              <span className="grid grid-cols-[minmax(5.5rem,7rem)_minmax(0,1fr)] gap-x-4">
                <span>Shift</span>
                <span>Status</span>
              </span>
            </th>
            <th className="label-caps px-3 py-2 text-outline">Amount</th>
            <th className="label-caps px-3 py-2 text-outline">Lock</th>
            <th className="label-caps px-3 py-2 text-right text-outline">Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-10 text-center text-on-surface-variant">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            records.map((row) => {
              const totalAmount = sumShiftAmounts(row.shifts);
              const attendanceKey = String(row.attendanceId);
              const unlockPending = pendingAttendanceIds?.has(attendanceKey);
              return (
                <tr key={row.attendanceId} className="border-t border-outline-variant/30 hover:bg-surface-container-high/50">
                  <td className="px-3 py-2">{formatDateLabel(row.date)}</td>
                  <td className="px-3 py-2">
                    <AttendanceShiftStatusPairs shifts={row.shifts} />
                  </td>
                  <td className="label-numeric px-3 py-2 text-on-surface">
                    {totalAmount != null ? formatCurrencyInr(totalAmount) : 'N/A'}
                  </td>
                  <td className="px-3 py-2">
                    <StatusChip tone={row.lockAttendance ? 'locked' : 'neutral'}>
                      {row.lockAttendance ? 'Locked' : 'Open'}
                    </StatusChip>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      {showUnlockAction && row.lockAttendance ? (
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled={unlockPending}
                          onClick={() => onRequestUnlock?.(row)}
                        >
                          {unlockPending ? 'Pending' : 'Request unlock'}
                        </Button>
                      ) : null}
                      {detailBasePath ? (
                        <Link
                          className="font-semibold text-primary"
                          to={`${detailBasePath}?attendanceId=${row.attendanceId}`}
                        >
                          View
                        </Link>
                      ) : null}
                    </div>
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
