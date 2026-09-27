import { Link } from 'react-router-dom';
import { sumShiftAmounts } from '../../utils/myAttendanceList.js';
import AttendanceShiftStatusPairs from '../attendance/AttendanceShiftStatusPairs.jsx';
import StatusChip from '../ui/StatusChip.jsx';
import { formatCurrencyInr, formatDateLabel } from '../../utils/format.js';
import Button from '../ui/Button.jsx';
import TableCard from '../common/TableCard.jsx';
import { MobileListCard, MobileListStack } from '../common/MobileList.jsx';

export default function EmployeeAttendanceHistoryTable({
  records,
  detailBasePath,
  emptyMessage = 'No attendance records in this range.',
  showUnlockAction,
  pendingAttendanceIds,
  onRequestUnlock,
}) {
  if (records.length === 0) {
    return (
      <p className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest px-4 py-10 text-center text-on-surface-variant shadow-card">
        {emptyMessage}
      </p>
    );
  }

  return (
    <>
      <MobileListStack>
        {records.map((row) => {
          const totalAmount = sumShiftAmounts(row.shifts);
          const attendanceKey = String(row.attendanceId);
          const unlockPending = pendingAttendanceIds?.has(attendanceKey);
          return (
            <MobileListCard key={row.attendanceId}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="font-semibold">{formatDateLabel(row.date)}</p>
                <StatusChip tone={row.lockAttendance ? 'locked' : 'neutral'}>
                  {row.lockAttendance ? 'Locked' : 'Open'}
                </StatusChip>
              </div>
              <div className="mt-3">
                <p className="label-caps mb-1 text-outline">Shifts</p>
                <AttendanceShiftStatusPairs shifts={row.shifts} />
              </div>
              <p className="mt-3 label-numeric text-on-surface">
                {totalAmount != null ? formatCurrencyInr(totalAmount) : 'N/A'}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
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
                    className="inline-flex h-10 items-center font-semibold text-primary"
                    to={`${detailBasePath}?attendanceId=${row.attendanceId}`}
                  >
                    View detail
                  </Link>
                ) : null}
              </div>
            </MobileListCard>
          );
        })}
      </MobileListStack>

      <TableCard className="rounded-lg" minTableWidth="md:min-w-[44rem]">
        <thead className="border-b border-outline-variant/40 bg-surface-container-low">
          <tr>
            <th className="label-caps px-3 py-2 text-outline">Date</th>
            <th className="label-caps px-3 py-2 text-outline md:min-w-[14rem]">
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
          {records.map((row) => {
            const totalAmount = sumShiftAmounts(row.shifts);
            const attendanceKey = String(row.attendanceId);
            const unlockPending = pendingAttendanceIds?.has(attendanceKey);
            return (
              <tr
                key={row.attendanceId}
                className="border-t border-outline-variant/30 hover:bg-surface-container-high/50"
              >
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
          })}
        </tbody>
      </TableCard>
    </>
  );
}
