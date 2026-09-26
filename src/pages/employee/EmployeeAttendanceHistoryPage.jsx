import { useCallback, useEffect, useState } from 'react';
import { listMyAttendance } from '../../api/attendance.js';
import { ROUTES } from '../../constants/routes.js';
import { getMyAttendanceListItems, listRangeLastDays } from '../../utils/myAttendanceList.js';
import EmployeeAttendanceHistoryTable from '../../components/employee/EmployeeAttendanceHistoryTable.jsx';
import AttendanceDateRangeFilter from '../../components/attendance/AttendanceDateRangeFilter.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';

const DEFAULT_RANGE_DAYS = 30;

export default function EmployeeAttendanceHistoryPage() {
  const initialRange = listRangeLastDays(DEFAULT_RANGE_DAYS);
  const [startDate, setStartDate] = useState(initialRange.startDate);
  const [endDate, setEndDate] = useState(initialRange.endDate);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async (from, to) => {
    setLoading(true);
    setError('');
    try {
      const data = await listMyAttendance({
        startDate: from,
        endDate: to,
        page: 1,
        limit: 50,
      });
      setRecords(getMyAttendanceListItems(data));
    } catch (err) {
      setError(err.message);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(initialRange.startDate, initialRange.endDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initial range only on mount
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
        <h1 className="text-2xl font-bold">Attendance history</h1>
        <p className="text-sm text-on-surface-variant">
          Filter by date range (default: last {DEFAULT_RANGE_DAYS} days).
        </p>
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
      <EmployeeAttendanceHistoryTable
        records={records}
        detailBasePath={ROUTES.employee.attendanceDetail}
        emptyMessage="No attendance records for this date range."
      />
    </div>
  );
}
