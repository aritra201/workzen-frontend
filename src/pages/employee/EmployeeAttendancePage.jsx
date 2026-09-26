import { useCallback, useEffect, useState } from 'react';
import { getTodayAttendance } from '../../api/attendance.js';
import { SHIFT_KEY } from '../../constants/shifts.js';
import { formatDateLabel } from '../../utils/format.js';
import { isShiftVisible } from '../../utils/attendanceUi.js';
import ShiftAttendanceCard from '../../components/attendance/ShiftAttendanceCard.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import TextField from '../../components/ui/TextField.jsx';

const ORDER = [SHIFT_KEY.DAY, SHIFT_KEY.NIGHT, SHIFT_KEY.EXTRA_DAY, SHIFT_KEY.EXTRA_NIGHT];

export default function EmployeeAttendancePage() {
  const [attendance, setAttendance] = useState(null);
  const [attendanceDate, setAttendanceDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getTodayAttendance(
        attendanceDate ? { attendanceDate } : undefined
      );
      setAttendance(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [attendanceDate]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading && !attendance) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-surface-container-lowest p-4 shadow-card">
        <p className="text-base font-semibold">
          {formatDateLabel(attendance?.date, { weekday: true })}
        </p>
        {attendance?.lockAttendance ? (
          <p className="mt-1 text-xs text-error">This day is locked. Request an unlock from history.</p>
        ) : (
          <p className="mt-1 text-xs text-on-surface-variant">Complete each confirmed shift before cutoff.</p>
        )}
        <TextField
          className="mt-3"
          id="attendance-date"
          label="Unlock date (optional)"
          type="date"
          value={attendanceDate}
          onChange={(e) => setAttendanceDate(e.target.value)}
          hint="Use when editing an approved unlock for a past date"
        />
      </div>

      <ErrorMessage message={error} />

      {ORDER.filter((key) => isShiftVisible(attendance, key)).map((shiftKey) => (
        <ShiftAttendanceCard
          key={shiftKey}
          shiftKey={shiftKey}
          shift={
            shiftKey === SHIFT_KEY.DAY
              ? attendance?.shifts?.day ?? { marked: false }
              : shiftKey === SHIFT_KEY.NIGHT
                ? attendance?.shifts?.night ?? { marked: false }
                : shiftKey === SHIFT_KEY.EXTRA_DAY
                  ? attendance?.shifts?.extraDay
                  : attendance?.shifts?.extraNight
          }
          attendance={attendance}
          attendanceDate={attendanceDate || undefined}
          onUpdated={load}
        />
      ))}
    </div>
  );
}
