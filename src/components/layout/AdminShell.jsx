import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { ADMIN_NAV } from '../../constants/navigation.js';
import Icon from '../ui/Icon.jsx';
import CompanyNameGate from '../auth/CompanyNameGate.jsx';
import DashboardShell from './DashboardShell.jsx';

function ShiftCutoffFooter() {
  return (
    <div className="m-3 rounded-xl bg-surface-container-low p-3">
      <div className="flex items-center gap-2 text-secondary">
        <Icon name="schedule" size={18} />
        <span className="text-[10px] font-semibold uppercase">Shift cutoff</span>
      </div>
      <p className="mt-1 text-xs font-medium">Attendance lock: 11:59 PM</p>
    </div>
  );
}

export default function AdminShell({ badges = {} }) {
  const { user, logout, primaryMembership } = useAuth();
  const location = useLocation();
  const headerTitle = location.pathname.split('/').pop()?.replace('-', ' ') || 'Admin';

  return (
    <DashboardShell
      brandTitle="WorkZen Admin"
      brandSubtitle="Employee & Payroll"
      navItems={ADMIN_NAV}
      badges={badges}
      sidebarFooter={<ShiftCutoffFooter />}
      headerCompanyName={primaryMembership?.companyName}
      headerTitle={headerTitle}
      userEmail={user?.email}
      onLogout={logout}
    >
      <CompanyNameGate>
        <Outlet />
      </CompanyNameGate>
    </DashboardShell>
  );
}
