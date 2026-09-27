import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listCompanyAttendance } from '../../api/companyAttendance.js';
import {
  attendanceVerificationStatus,
  getAttendanceEmployeeName,
  getAttendanceEmployeeProfilePicture,
  getCompanyAttendanceListItems,
  sumShiftAmounts,
} from '../../utils/companyAttendanceList.js';
import { listRangeLastDays } from '../../utils/myAttendanceList.js';
import AttendanceDateRangeFilter from '../../components/attendance/AttendanceDateRangeFilter.jsx';
import ShiftHighlightChips from '../../components/ui/ShiftHighlightChips.jsx';
import { formatCurrencyInr, formatDateLabel } from '../../utils/format.js';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import PersonAvatar from '../../components/ui/PersonAvatar.jsx';
import StatusChip from '../../components/ui/StatusChip.jsx';

const DEFAULT_RANGE_DAYS = 30;

export default function CompanyAttendanceListPage({
  title,
  detailBasePath,
  statusFilter,
  readOnly,
}) {
  const initialRange = listRangeLastDays(DEFAULT_RANGE_DAYS);
  const [startDate, setStartDate] = useState(initialRange.startDate);
  const [endDate, setEndDate] = useState(initialRange.endDate);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(
    async (from, to) => {
      setLoading(true);
      setError('');
      try {
        const params = {
          startDate: from,
          endDate: to,
          limit: 50,
          page: 1,
          fresh: true,
        };
        if (statusFilter) {
          params.status = statusFilter;
        }
        const data = await listCompanyAttendance(params);
        setRecords(getCompanyAttendanceListItems(data));
      } catch (err) {
        setError(err.message);
        setRecords([]);
      } finally {
        setLoading(false);
      }
    },
    [statusFilter]
  );

  useEffect(() => {
    load(startDate, endDate);
  }, [load]);

  function handleApply() {
    load(startDate, endDate);
  }

  if (loading && records.length === 0 && !error) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {readOnly ? (
          <p className="text-sm text-on-surface-variant">View-only member access</p>
        ) : (
          <p className="text-sm text-on-surface-variant">
            Filter by date range (default: last {DEFAULT_RANGE_DAYS} days).
          </p>
        )}
      </div>

      <AttendanceDateRangeFilter
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onApply={handleApply}
        loading={loading}
      />

      <ErrorMessage message={error} />

      <div className="overflow-hidden rounded-lg border border-outline-variant/40 bg-surface-container-lowest shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-outline-variant/40 bg-surface-container-low">
            <tr>
              <th className="label-caps px-3 py-2 text-outline">Employee</th>
              <th className="label-caps px-3 py-2 text-outline">Date</th>
              <th className="label-caps px-3 py-2 text-outline">Shift</th>
              <th className="label-caps px-3 py-2 text-outline">Amount</th>
              <th className="label-caps px-3 py-2 text-outline">Status</th>
              <th className="label-caps px-3 py-2 text-right text-outline">Detail</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-on-surface-variant">
                  No attendance records for this date range.
                </td>
              </tr>
            ) : (
              records.map((row) => {
                const verification = attendanceVerificationStatus(row.shifts);
                const totalAmount = sumShiftAmounts(row.shifts);
                const employeeName = getAttendanceEmployeeName(row);
                return (
                  <tr
                    key={row.attendanceId}
                    className="border-t border-outline-variant/30 hover:bg-surface-container-high/50"
                  >
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-3">
                        <PersonAvatar
                          name={employeeName}
                          email={row.employee?.email}
                          src={getAttendanceEmployeeProfilePicture(row)}
                          size={36}
                        />
                        <span className="font-medium">{employeeName}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2">{formatDateLabel(row.date)}</td>
                    <td className="px-3 py-2">
                      <ShiftHighlightChips shifts={row.shifts} />
                    </td>
                    <td className="label-numeric px-3 py-2 text-on-surface">
                      {totalAmount != null ? formatCurrencyInr(totalAmount) : 'N/A'}
                    </td>
                    <td className="px-3 py-2">
                      <StatusChip tone={verification.tone}>{verification.label}</StatusChip>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Link
                        className="font-semibold text-primary"
                        to={`${detailBasePath}?attendanceId=${row.attendanceId}`}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
