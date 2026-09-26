import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getMyEmployeeProfile } from '../../api/employees.js';
import { getTodayAttendance } from '../../api/attendance.js';
import { ROUTES } from '../../constants/routes.js';
import Button from '../../components/ui/Button.jsx';
import Icon from '../../components/ui/Icon.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';

export default function EmployeeDashboardPage() {
  const [profile, setProfile] = useState(null);
  const [today, setToday] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyEmployeeProfile(), getTodayAttendance()])
      .then(([p, t]) => {
        setProfile(p);
        setToday(t);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const openShift = !today?.lockAttendance && today?.canEdit;

  return (
    <div className="space-y-5">
      <section className="rounded-xl bg-surface-container-low p-5 shadow-sm">
        <p className="text-lg font-semibold">Namaste, {profile?.employeeName || 'there'}</p>
        <p className="text-sm text-on-surface-variant">{profile?.employeeEmail}</p>
      </section>

      <section className="rounded-xl bg-surface-container-lowest p-5 shadow-md">
        <p className="text-xs font-semibold uppercase text-tertiary">Today</p>
        <h2 className="mt-1 text-xl font-semibold">{openShift ? 'Shift window open' : 'Ledger locked or closed'}</h2>
        <p className="mt-2 text-sm text-on-surface-variant">
          Submit attendance before the company cutoff. Cutoff rule: 11:59 PM in company timezone.
        </p>
        <Link to={ROUTES.employee.attendance} className="mt-4 block">
          <Button className="w-full">
            Mark today&apos;s attendance
            <Icon name="arrow_forward" size={18} />
          </Button>
        </Link>
      </section>

      <Link to={ROUTES.employee.attendanceHistory} className="block rounded-xl bg-surface-container-lowest p-4 shadow-card">
        <p className="font-semibold">Attendance history</p>
        <p className="text-sm text-on-surface-variant">Past days, unlock requests, and verification status</p>
      </Link>
    </div>
  );
}
