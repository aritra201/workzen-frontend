import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { MEMBER_NAV } from '../../constants/navigation.js';
import DashboardShell from './DashboardShell.jsx';

const PAGE_TITLES = {
  dashboard: 'Overview',
  attendance: 'Attendance',
  profile: 'My profile',
};

function pageTitleFromPath(pathname) {
  const segment = pathname.split('/').filter(Boolean).pop() || 'dashboard';
  return PAGE_TITLES[segment] || 'Member';
}

export default function MemberShell() {
  const { user, logout, primaryMembership } = useAuth();
  const location = useLocation();

  return (
    <DashboardShell
      brandTitle="WorkZen"
      brandSubtitle="Member view"
      navItems={MEMBER_NAV}
      sidebarWidth="narrow"
      headerCompanyName={primaryMembership?.companyName}
      headerTitle={pageTitleFromPath(location.pathname)}
      userEmail={user?.email}
      onLogout={logout}
    >
      <Outlet />
    </DashboardShell>
  );
}
