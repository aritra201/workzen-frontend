import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listEmployees, listPresentEmployees } from '../../api/employees.js';
import { listUnlockRequestsAdmin } from '../../api/unlockRequests.js';
import { listCompanyAttendance } from '../../api/companyAttendance.js';
import { ROUTES } from '../../constants/routes.js';
import {
  getAttendanceEmployeeName,
  getCompanyAttendanceListItems,
  shiftVerificationSummary,
} from '../../utils/companyAttendanceList.js';
import Icon from '../../components/ui/Icon.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [employees, present, unlocks, pending] = await Promise.all([
          listEmployees({ limit: 1, page: 1 }),
          listPresentEmployees({ limit: 1 }),
          listUnlockRequestsAdmin({ status: 'pending', limit: 1 }),
          listCompanyAttendance({ status: 'pending_verification', limit: 5 }),
        ]);
        setStats({
          workforce: employees?.total ?? employees?.employees?.length ?? 0,
          present: present?.total ?? present?.employees?.length ?? 0,
          unlocks: unlocks?.total ?? 0,
          pending: pending?.total ?? 0,
          recent: getCompanyAttendanceListItems(pending),
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  const cards = [
    {
      label: 'Workforce pool',
      value: stats?.workforce ?? 0,
      sub: `${stats?.present ?? 0} present today`,
      icon: 'engineering',
      to: ROUTES.admin.employees,
    },
    {
      label: 'Verification queue',
      value: stats?.pending ?? 0,
      sub: 'Pending shift reviews',
      icon: 'fact_check',
      to: ROUTES.admin.verification,
    },
    {
      label: 'Unlock requests',
      value: stats?.unlocks ?? 0,
      sub: 'Awaiting decision',
      icon: 'lock_open',
      to: ROUTES.admin.unlockRequests,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-outline">Operations HQ</p>
        <h1 className="text-2xl font-bold">Dashboard overview</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="rounded-xl bg-surface-container-lowest p-5 shadow-card transition hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-outline">{card.label}</span>
              <Icon name={card.icon} className="text-primary" />
            </div>
            <p className="mt-3 text-3xl font-bold tabular-nums">{card.value}</p>
            <p className="text-sm text-on-surface-variant">{card.sub}</p>
          </Link>
        ))}
      </div>

      <section className="rounded-xl bg-surface-container-lowest p-5 shadow-card">
        <h2 className="text-lg font-semibold">Recent pending verifications</h2>
        <ul className="mt-4 divide-y divide-surface-container-high">
          {(stats?.recent || []).map((row) => (
            <li key={row.attendanceId} className="flex items-center justify-between py-3 text-sm">
              <span>{getAttendanceEmployeeName(row)} · {row.date}</span>
              <span className="font-semibold text-on-surface-variant">{shiftVerificationSummary(row.shifts)}</span>
            </li>
          ))}
          {!stats?.recent?.length ? (
            <li className="py-6 text-center text-on-surface-variant">No pending records in the current window.</li>
          ) : null}
        </ul>
      </section>
    </div>
  );
}
