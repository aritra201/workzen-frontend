import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.js';
import { useAuth } from '../../hooks/useAuth.js';

export default function MemberDashboardPage() {
  const { primaryMembership } = useAuth();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Member overview</h1>
      <p className="text-on-surface-variant">
        Read-only access to {primaryMembership?.companyName || 'company'} attendance records.
        Activity history for each record is available when you open a shift from the attendance list.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          to={ROUTES.member.attendance}
          className="rounded-xl bg-surface-container-lowest p-5 shadow-card hover:shadow-md"
        >
          <p className="font-semibold">Attendance ledger</p>
          <p className="text-sm text-on-surface-variant">View verified and pending shifts</p>
        </Link>
        <Link
          to={ROUTES.member.profile}
          className="rounded-xl bg-surface-container-lowest p-5 shadow-card hover:shadow-md"
        >
          <p className="font-semibold">My profile</p>
          <p className="text-sm text-on-surface-variant">Name and profile photo</p>
        </Link>
      </div>
    </div>
  );
}
