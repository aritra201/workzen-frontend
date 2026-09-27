import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { EMPLOYEE_NAV } from '../../constants/navigation.js';
import Icon from '../ui/Icon.jsx';
import EmployeeProfileGate from '../auth/EmployeeProfileGate.jsx';
import DashboardShell from './DashboardShell.jsx';

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  attendance: 'Mark attendance',
  history: 'Attendance history',
  record: 'Record detail',
  unlock: 'Unlock requests',
  'unlock-requests': 'Unlock requests',
  profile: 'My profile',
};

function pageTitleFromPath(pathname) {
  const segment = pathname.split('/').filter(Boolean).pop() || 'dashboard';
  return PAGE_TITLES[segment] || 'Employee';
}

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

export default function EmployeeShell() {
  const { user, logout, primaryMembership } = useAuth();
  const location = useLocation();
  const pageTitle = pageTitleFromPath(location.pathname);

  return (
    <DashboardShell
      brandTitle="WorkZen"
      brandSubtitle="Employee portal"
      navItems={EMPLOYEE_NAV}
      sidebarFooter={<ShiftCutoffFooter />}
      headerCompanyName={primaryMembership?.companyName}
      headerTitle={pageTitle}
      userEmail={user?.email}
      onLogout={logout}
      mainInnerClassName="mx-auto max-w-6xl"
    >
      <EmployeeProfileGate>
        <Outlet />
      </EmployeeProfileGate>
    </DashboardShell>
  );
}
