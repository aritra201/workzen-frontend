import { Link } from 'react-router-dom';
import {
  attendanceVerificationStatus,
  sumShiftAmounts,
} from '../../utils/myAttendanceList.js';
import ShiftHighlightChips from '../ui/ShiftHighlightChips.jsx';
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
    <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-card">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface-container-low text-xs uppercase text-outline">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Shift</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Lock</th>
            <th className="px-4 py-3 text-right">Actions</th>
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
              const verification = attendanceVerificationStatus(row.shifts);
              const totalAmount = sumShiftAmounts(row.shifts);
              const attendanceKey = String(row.attendanceId);
              const unlockPending = pendingAttendanceIds?.has(attendanceKey);
              return (
                <tr key={row.attendanceId} className="border-t border-surface-container-high">
                  <td className="px-4 py-3">{formatDateLabel(row.date)}</td>
                  <td className="px-4 py-3">
                    <ShiftHighlightChips shifts={row.shifts} />
                  </td>
                  <td className="px-4 py-3 tabular-nums text-on-surface-variant">
                    {totalAmount != null ? formatCurrencyInr(totalAmount) : 'N/A'}
                  </td>
                  <td className="px-4 py-3">
                    <StatusChip tone={verification.tone}>{verification.label}</StatusChip>
                  </td>
                  <td className="px-4 py-3">
                    <StatusChip tone={row.lockAttendance ? 'locked' : 'pending'}>
                      {row.lockAttendance ? 'Locked' : 'Open'}
                    </StatusChip>
                  </td>
                  <td className="px-4 py-3">
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
