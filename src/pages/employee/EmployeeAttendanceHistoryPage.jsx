import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listMyAttendance } from '../../api/attendance.js';
import { ROUTES } from '../../constants/routes.js';
import { formatCurrencyInr, formatDateLabel } from '../../utils/format.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';

export default function EmployeeAttendanceHistoryPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listMyAttendance({ limit: 40 })
      .then((data) => setRecords(data.records || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Attendance history</h1>
      {records.map((row) => (
        <Link
          key={row.attendanceId}
          to={`${ROUTES.employee.attendanceDetail}?attendanceId=${row.attendanceId}`}
          className="flex items-center justify-between rounded-xl bg-surface-container-lowest p-4 shadow-card"
        >
          <div>
            <p className="font-semibold">{formatDateLabel(row.date)}</p>
            <p className="text-xs text-on-surface-variant">{row.lockAttendance ? 'Locked' : 'Editable'}</p>
          </div>
          <span className="font-bold tabular-nums">{formatCurrencyInr(row.totalAmount)}</span>
        </Link>
      ))}
    </div>
  );
}
