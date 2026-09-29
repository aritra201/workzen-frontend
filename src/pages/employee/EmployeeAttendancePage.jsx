import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTodayAttendance } from '../../api/attendance.js';
import { SHIFT_KEY } from '../../constants/shifts.js';
import { ROUTES } from '../../constants/routes.js';
import { formatDateLabel } from '../../utils/format.js';
import { isShiftVisible, shiftFromResponse } from '../../utils/attendanceUi.js';
import ShiftAttendanceCard from '../../components/attendance/ShiftAttendanceCard.jsx';
import { AccordionGroup } from '../../components/ui/AccordionGroup.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';

const ORDER = [SHIFT_KEY.DAY, SHIFT_KEY.NIGHT, SHIFT_KEY.EXTRA_DAY, SHIFT_KEY.EXTRA_NIGHT];

export default function EmployeeAttendancePage() {
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getTodayAttendance();
      setAttendance(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading && !attendance) return <LoadingSpinner />;

  const visibleShiftKeys = ORDER.filter((key) => isShiftVisible(attendance, key));

  return (
    <div className="space-y-6">
      <Link to={ROUTES.employee.dashboard} className="text-sm font-semibold text-primary">
        ← Back
      </Link>
      <h1 className="text-2xl font-bold">Mark attendance</h1>
      <div className="rounded-xl bg-surface-container-lowest p-4 shadow-card">
        <p className="text-base font-semibold">
          {formatDateLabel(attendance?.date, { weekday: true })}
        </p>
        {attendance?.lockAttendance ? (
          <p className="mt-1 text-xs text-error">
            This day is locked. Request an unlock from the unlock requests page.
          </p>
        ) : (
          <p className="mt-1 text-xs text-on-surface-variant">
            Confirm each shift you worked — amount is applied from your profile. Comments and photos
            are optional.
          </p>
        )}
      </div>

      <ErrorMessage message={error} />

      <AccordionGroup defaultOpenId={visibleShiftKeys[0] ?? null}>
        {visibleShiftKeys.map((shiftKey) => (
          <ShiftAttendanceCard
            key={shiftKey}
            accordionId={shiftKey}
            shiftKey={shiftKey}
            shift={shiftFromResponse(attendance, shiftKey)}
            attendance={attendance}
            onUpdated={load}
          />
        ))}
      </AccordionGroup>
    </div>
  );
}
