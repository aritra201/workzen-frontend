import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listCompanyAttendance } from '../../api/companyAttendance.js';
import {
  attendanceVerificationStatus,
  getAttendanceEmployeeName,
  getAttendanceEmployeeProfilePicture,
  getCompanyAttendanceListItems,
  sumShiftAmounts,
} from '../../utils/companyAttendanceList.js';
import ShiftHighlightChips from '../../components/ui/ShiftHighlightChips.jsx';
import { formatCurrencyInr, formatDateLabel } from '../../utils/format.js';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import PersonAvatar from '../../components/ui/PersonAvatar.jsx';
import StatusChip from '../../components/ui/StatusChip.jsx';

export default function CompanyAttendanceListPage({
  title,
  detailBasePath,
  statusFilter,
  readOnly,
}) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const params = { limit: 50, page: 1 };
        if (statusFilter) params.status = statusFilter;
        const data = await listCompanyAttendance(params);
        if (cancelled) return;
        setRecords(getCompanyAttendanceListItems(data));
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [statusFilter]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {readOnly ? <p className="text-sm text-on-surface-variant">View-only member access</p> : null}
      </div>
      <ErrorMessage message={error} />

      <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-container-low text-xs uppercase text-outline">
            <tr>
              <th className="px-4 py-3">Employee</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Shift</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Detail</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-on-surface-variant">
                  No attendance records in this range.
                </td>
              </tr>
            ) : (
              records.map((row) => {
                const verification = attendanceVerificationStatus(row.shifts);
                const totalAmount = sumShiftAmounts(row.shifts);
                const employeeName = getAttendanceEmployeeName(row);
                return (
                  <tr key={row.attendanceId} className="border-t border-surface-container-high">
                    <td className="px-4 py-3">
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
                    <td className="px-4 py-3 text-right">
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
